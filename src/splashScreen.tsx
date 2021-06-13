import { useState, useEffect, useRef, memo } from "react";
import type { ReactNode, FC } from "react";
import { createUseClassNames, useThemeBase } from "./lib/ThemeProvider";
import { css, cx, keyframes } from "tss-react";
import { useDomRect } from "powerhooks";
import Color from "color";
import { createUseGlobalState } from "powerhooks";
import { useRerenderOnStateChange } from "evt/hooks";
import { useConstCallback } from "powerhooks";

let fadeOutDuration = 700;

export function setSplashScreenFadeOutDuration(value: number) {
    fadeOutDuration = value;
}

const { useSplashScreen, useSplashScreenStatus } = (() => {
    const { evtDisplayState } = createUseGlobalState(
        "displayState",
        { "count": 1, "isTransparencyEnabled": false, "prevTime": 0 },
        { "persistance": false },
    );

    const { globalHideSplashScreen } = (() => {
        const { getDoUseDelay } = (() => {
            const { evtLastDelayedTime } = createUseGlobalState("lastDelayedTime", 0, {
                "persistance": "localStorage",
            });

            function getDoUseDelay() {
                const doUseDelay = Date.now() - evtLastDelayedTime.state > 30000;

                if (doUseDelay) {
                    evtLastDelayedTime.state = Date.now();
                }

                return doUseDelay;
            }

            return { getDoUseDelay };
        })();

        async function globalHideSplashScreen() {
            evtDisplayState.state.count = Math.max(evtDisplayState.state.count - 1, 0);

            if (getDoUseDelay()) {
                await new Promise(resolve => setTimeout(resolve, 1000));
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

                const delayLeft = [fadeOutDuration - (Date.now() - prevTime)].filter(v => v > 0)[0] ?? 0;

                let timer: ReturnType<typeof setTimeout>;

                (async () => {
                    await new Promise(resolve => (timer = setTimeout(resolve, delayLeft)));

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
                "isTransparencyEnabled": evtDisplayState.state.isTransparencyEnabled,
            };
        }

        return { useSplashScreenStatus };
    })();

    const { useSplashScreen } = (() => {
        let isFirstUsageOfUseSplashScreen = true;

        function useSplashScreen(params?: { onHidden?(): void }) {
            const { showSplashScreen, hideSplashScreen } = (function useClosure() {
                const countRef = useRef<number | undefined>(undefined);

                useEffect(() => {
                    if (isFirstUsageOfUseSplashScreen) {
                        countRef.current = 1;

                        isFirstUsageOfUseSplashScreen = false;
                    } else {
                        countRef.current = 0;
                    }
                }, []);

                const showSplashScreen = useConstCallback<typeof globalShowSplashScreen>(
                    ({ enableTransparency }) => {
                        if (countRef.current === undefined) {
                            throw new Error("showSplashScreen must be called after component mounted");
                        }

                        countRef.current++;

                        globalShowSplashScreen({ enableTransparency });
                    },
                );

                const hideSplashScreen = useConstCallback<typeof globalHideSplashScreen>(async () => {
                    if (countRef.current === undefined) {
                        throw new Error("hideSplashScreen must be called after component mounted");
                    }

                    if (countRef.current === 0) {
                        return;
                    }

                    countRef.current--;

                    await globalHideSplashScreen();
                });

                return { showSplashScreen, hideSplashScreen };
            })();

            const { isSplashScreenShown, isTransparencyEnabled } = useSplashScreenStatus(params);

            return {
                isSplashScreenShown,
                isTransparencyEnabled,
                showSplashScreen,
                hideSplashScreen,
            };
        }

        return { useSplashScreen };
    })();

    return { useSplashScreen, useSplashScreenStatus };
})();

export { useSplashScreen };

const fadeInAndOut = keyframes`
60%, 100% {
    opacity: 0;
}
0% {
    opacity: 0;
}
40% {
    opacity: 1;
}
`;

const { useClassNames } = createUseClassNames<{
    isVisible: boolean;
    isFadingOut: boolean;
    isTransparencyEnabled: boolean;
    fillColor: string;
}>()((theme, { isVisible, isFadingOut, isTransparencyEnabled, fillColor }) => ({
    "root": {
        "backgroundColor": (() => {
            const color = new Color(theme.colors.useCases.surfaces.background).rgb();

            return color.alpha(isTransparencyEnabled ? 0.6 : (color as any).valpha).string();
        })(),
        "backdropFilter": isTransparencyEnabled ? "blur(10px)" : undefined,
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "visibility": isVisible ? "visible" : "hidden",
        "opacity": isFadingOut ? 0 : 1,
        "transition": `opacity ease-in-out ${fadeOutDuration}ms`,
        "& g": {
            "opacity": 0,
            "animation": `${fadeInAndOut} 3.5s infinite ease-in-out`,
            "&:nth-child(1)": {
                "animationDelay": ".4s",
            },
            "&:nth-child(2)": {
                "animationDelay": ".8s",
            },
            "&:nth-child(3)": {
                "animationDelay": "1.2s",
            },
        },
    },
    "svg": {
        "fill": fillColor,
        "height": "20%",
    },
}));

type Props = {
    className?: string;
    Logo(props: { className?: string }): ReturnType<FC>;
    fillColor: string;
};

const SplashScreen = memo((props: Props) => {
    const { className, Logo, fillColor } = props;

    const { isSplashScreenShown, isTransparencyEnabled } = useSplashScreenStatus();

    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const { classNames } = useClassNames({
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

                await new Promise(resolve => (timer = setTimeout(resolve, fadeOutDuration)));

                setIsFadingOut(false);
                setIsVisible(false);
            }
        })();

        return () => clearTimeout(timer);
    }, [isSplashScreenShown]);

    return (
        <div className={cx(classNames.root, className)}>
            <Logo className={classNames.svg} />
        </div>
    );
});

export function SplashScreenProvider(props: {
    Logo(props: { className?: string }): ReturnType<FC>;
    fillColor?: string;
    children: ReactNode;
}) {
    const { themeBase } = useThemeBase();

    const { children, Logo, fillColor = themeBase.colors.palette.focus.main } = props;

    const {
        ref,
        domRect: { width, height },
    } = useDomRect();

    return (
        <div ref={ref} className={css({ "height": "100%" })}>
            <SplashScreen
                className={css({ width, "position": "absolute", height, "zIndex": 10 })}
                Logo={Logo}
                fillColor={fillColor}
            />
            {children}
        </div>
    );
}
