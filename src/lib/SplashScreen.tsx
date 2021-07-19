import { useState, useEffect, useRef, memo } from "react";
import type { ReactNode, FC } from "react";
import { useDomRect } from "powerhooks/useDomRect";
import Color from "color";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { useRerenderOnStateChange } from "evt/hooks";
import { useConstCallback } from "powerhooks/useConstCallback";
import { createMakeStyles, keyframes, css } from "tss-react";
import type { Theme } from "./ThemeProvider";

let fadeOutDuration = 700;
let minimumDisplayDuration = 1000;

const { useSplashScreen, useSplashScreenStatus } = (() => {
    const { evtDisplayState } = createUseGlobalState(
        "displayState",
        { "count": 1, "isTransparencyEnabled": false, "prevTime": 0 },
        { "persistance": false },
    );

    const { globalHideSplashScreen } = (() => {
        const { getDoUseDelay } = (() => {
            const { evtLastDelayedTime } = createUseGlobalState(
                "lastDelayedTime",
                0,
                {
                    "persistance": "localStorage",
                },
            );

            function getDoUseDelay() {
                const doUseDelay =
                    Date.now() - evtLastDelayedTime.state > 30000;

                if (doUseDelay) {
                    evtLastDelayedTime.state = Date.now();
                }

                return doUseDelay;
            }

            return { getDoUseDelay };
        })();

        async function globalHideSplashScreen() {
            evtDisplayState.state.count = Math.max(
                evtDisplayState.state.count - 1,
                0,
            );

            if (getDoUseDelay()) {
                await new Promise(resolve =>
                    setTimeout(resolve, minimumDisplayDuration),
                );
            }

            evtDisplayState.state = {
                ...evtDisplayState.state,
                "prevTime": Date.now(),
            };
        }

        return { globalHideSplashScreen };
    })();

    function globalShowSplashScreen(params: { enableTransparency: boolean }) {
        evtDisplayState.state = {
            "count": evtDisplayState.state.count + 1,
            "isTransparencyEnabled": params.enableTransparency,
            "prevTime": Date.now(),
        };
    }

    const { useSplashScreenStatus } = (() => {
        function useOnSplashScreenHidden(params: {
            onHidden: (() => void) | undefined;
            isSplashScreenShown: boolean;
            prevTime: number;
        }) {
            const { onHidden, isSplashScreenShown, prevTime } = params;

            useEffect(() => {
                if (isSplashScreenShown || onHidden === undefined) {
                    return;
                }

                const delayLeft =
                    [fadeOutDuration - (Date.now() - prevTime)].filter(
                        v => v > 0,
                    )[0] ?? 0;

                let timer: ReturnType<typeof setTimeout>;

                (async () => {
                    await new Promise(
                        resolve => (timer = setTimeout(resolve, delayLeft)),
                    );

                    onHidden();
                })();

                return () => clearTimeout(timer);
            }, [isSplashScreenShown]);
        }

        function useSplashScreenStatus(params?: { onHidden?(): void }) {
            const { onHidden } = params ?? {};

            useRerenderOnStateChange(evtDisplayState);

            const isSplashScreenShown = evtDisplayState.state.count > 0;

            useOnSplashScreenHidden({
                onHidden,
                isSplashScreenShown,
                "prevTime": evtDisplayState.state.prevTime,
            });

            return {
                isSplashScreenShown,
                "isTransparencyEnabled":
                    evtDisplayState.state.isTransparencyEnabled,
            };
        }

        return { useSplashScreenStatus };
    })();

    const { useSplashScreen } = (() => {
        function useSplashScreen(params?: {
            onHidden?(): void;
            fadeOutDuration?: number;
            minimumDisplayDuration?: number;
        }) {
            if (params?.fadeOutDuration !== undefined) {
                fadeOutDuration = params.fadeOutDuration;
            }

            if (params?.minimumDisplayDuration !== undefined) {
                minimumDisplayDuration = params.minimumDisplayDuration;
            }

            const { showSplashScreen, hideSplashScreen } =
                (function useClosure() {
                    const countRef = useRef<number>(0);

                    const showSplashScreen = useConstCallback<
                        typeof globalShowSplashScreen
                    >(({ enableTransparency }) => {
                        countRef.current++;

                        globalShowSplashScreen({ enableTransparency });
                    });

                    const hideSplashScreen = useConstCallback<
                        typeof globalHideSplashScreen
                    >(async () => {
                        if (countRef.current === 0) {
                            return;
                        }

                        countRef.current--;

                        await globalHideSplashScreen();
                    });

                    return { showSplashScreen, hideSplashScreen };
                })();

            const { isSplashScreenShown, isTransparencyEnabled } =
                useSplashScreenStatus(params);

            return {
                isSplashScreenShown,
                isTransparencyEnabled,
                "hideRootSplashScreen": globalHideSplashScreen,
                showSplashScreen,
                hideSplashScreen,
            };
        }

        return { useSplashScreen };
    })();

    return { useSplashScreen, useSplashScreenStatus };
})();

export { useSplashScreen };

export type SplashScreenProps = {
    Logo(props: { className?: string }): ReturnType<FC>;
    /** Default to focus main */
    fillColor?: string;
    /** Default 700ms */
    fadeOutDuration?: number;
    /** Default 1000 (1 second)*/
    minimumDisplayDuration?: number;
    children: ReactNode;
};

export function createSplashScreen(params: { useTheme(): Theme }) {
    const { useTheme } = params;

    const { makeStyles } = createMakeStyles({ useTheme });

    const { SplashScreen } = (() => {
        const { Overlay } = (() => {
            type Props = Pick<
                Required<SplashScreenProps>,
                "Logo" | "fillColor"
            > & { className?: string };

            const useStyles = makeStyles<{
                isVisible: boolean;
                isFadingOut: boolean;
                isTransparencyEnabled: boolean;
                fillColor: string;
            }>()(
                (
                    theme,
                    {
                        isVisible,
                        isFadingOut,
                        isTransparencyEnabled,
                        fillColor,
                    },
                ) => ({
                    "root": {
                        "backgroundColor": (() => {
                            const color = new Color(
                                theme.colors.useCases.surfaces.background,
                            ).rgb();

                            return color
                                .alpha(
                                    isTransparencyEnabled
                                        ? 0.6
                                        : (color as any).valpha,
                                )
                                .string();
                        })(),
                        "backdropFilter": isTransparencyEnabled
                            ? "blur(10px)"
                            : undefined,
                        "display": "flex",
                        "alignItems": "center",
                        "justifyContent": "center",
                        "visibility": isVisible ? "visible" : "hidden",
                        "opacity": isFadingOut ? 0 : 1,
                        "transition": `opacity ease-in-out ${fadeOutDuration}ms`,
                        "& g": {
                            "opacity": 0,
                            "animation": `${keyframes`
                            60%, 100% {
                                opacity: 0;
                            }
                            0% {
                                opacity: 0;
                            }
                            40% {
                                opacity: 1;
                            }
                            `} 3.5s infinite ease-in-out`,
                            "&:nth-of-type(1)": {
                                "animationDelay": ".4s",
                            },
                            "&:nth-of-type(2)": {
                                "animationDelay": ".8s",
                            },
                            "&:nth-of-type(3)": {
                                "animationDelay": "1.2s",
                            },
                        },
                    },
                    "svg": {
                        "fill": fillColor,
                        "height": "20%",
                    },
                }),
            );

            const Overlay = memo((props: Props) => {
                const { className, Logo, fillColor } = props;

                const { isSplashScreenShown, isTransparencyEnabled } =
                    useSplashScreenStatus();

                const [isFadingOut, setIsFadingOut] = useState(false);
                const [isVisible, setIsVisible] = useState(true);

                const { classes, cx } = useStyles({
                    isVisible,
                    isFadingOut,
                    isTransparencyEnabled,
                    fillColor,
                });

                useEffect(() => {
                    let timer = setTimeout(() => {
                        /* No action */
                    }, 0);

                    (async () => {
                        if (isSplashScreenShown) {
                            setIsFadingOut(false);
                            setIsVisible(true);
                        } else {
                            setIsFadingOut(true);

                            await new Promise(
                                resolve =>
                                    (timer = setTimeout(
                                        resolve,
                                        fadeOutDuration,
                                    )),
                            );

                            setIsFadingOut(false);
                            setIsVisible(false);
                        }
                    })();

                    return () => clearTimeout(timer);
                }, [isSplashScreenShown]);

                return (
                    <div className={cx(classes.root, className)}>
                        <Logo className={classes.svg} />
                    </div>
                );
            });

            return { Overlay };
        })();

        function SplashScreen(props: SplashScreenProps) {
            const theme = useTheme();

            const {
                children,
                Logo,
                fillColor = theme.colors.palette.focus.main,
            } = props;

            if (props?.fadeOutDuration !== undefined) {
                fadeOutDuration = props.fadeOutDuration;
            }

            if (props?.minimumDisplayDuration !== undefined) {
                minimumDisplayDuration = props.minimumDisplayDuration;
            }

            const {
                ref,
                domRect: { width, height },
            } = useDomRect();

            return (
                <div ref={ref} className={css({ "height": "100%" })}>
                    <Overlay
                        className={css({
                            width,
                            "position": "absolute",
                            height,
                            "zIndex": 10,
                        })}
                        Logo={Logo}
                        fillColor={fillColor}
                    />
                    {children}
                </div>
            );
        }

        return { SplashScreen };
    })();

    return { SplashScreen };
}
