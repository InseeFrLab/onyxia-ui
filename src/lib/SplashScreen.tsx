import {
    useState,
    useEffect,
    useRef,
    useContext,
    createContext,
    memo,
} from "react";
import type { ReactNode } from "react";
import Color from "color";
import { useRerenderOnStateChange } from "evt/hooks";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { useConstCallback } from "powerhooks/useConstCallback";
import { tss, keyframes } from "tss-react";
import type { Theme } from "./ThemeProvider";
import { Evt } from "evt";
import { id } from "tsafe/id";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import type { ReactComponent } from "../tools/ReactComponent";
import * as runExclusive from "run-exclusive";
import { useConst } from "powerhooks/useConst";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";

let fadeOutDuration = 700;
let minimumDisplayDuration = 1000;

const { useSplashScreen, useSplashScreenStatus } = (() => {
    const evtDisplayState = Evt.create({
        "count": 1,
        "isTransparencyEnabled": false,
        "prevTime": 0,
        "onHiddens": id<(() => void)[]>([]),
    });

    const { globalHideSplashScreen } = (() => {
        const { getDoUseDelay } = (() => {
            const { $lastDelayedTime } = createUseGlobalState({
                "name": "lastDelayedTime",
                "initialState": 0,
                "doPersistAcrossReloads": true,
            });

            const evtLastDelayedTime = statefulObservableToStatefulEvt<number>({
                "statefulObservable": $lastDelayedTime,
            });

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

        const next = runExclusive.build(async () => {
            if (getDoUseDelay()) {
                await new Promise(resolve =>
                    setTimeout(resolve, minimumDisplayDuration),
                );
            }

            evtDisplayState.state = {
                ...evtDisplayState.state,
                "prevTime": Date.now(),
            };
        });

        async function globalHideSplashScreen() {
            evtDisplayState.state.count = Math.max(
                evtDisplayState.state.count - 1,
                0,
            );

            if (runExclusive.isRunning(next)) {
                return;
            }

            next();
        }

        return { globalHideSplashScreen };
    })();

    function globalShowSplashScreen(params: { enableTransparency: boolean }) {
        evtDisplayState.state = {
            "count": evtDisplayState.state.count + 1,
            "isTransparencyEnabled": params.enableTransparency,
            "prevTime": Date.now(),
            "onHiddens": [],
        };
    }

    function useSplashScreenStatusInternal() {
        useRerenderOnStateChange(evtDisplayState);

        const { isSplashScreenShown, isTransparencyEnabled } =
            useGuaranteedMemo(
                () => ({
                    "isSplashScreenShown": evtDisplayState.state.count > 0,
                    "isTransparencyEnabled":
                        evtDisplayState.state.isTransparencyEnabled,
                }),
                [evtDisplayState.state],
            );

        return {
            isSplashScreenShown,
            isTransparencyEnabled,
        };
    }

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

        const isUsingSplashScreen = useContext(context);

        useEffect(() => {
            const { onHidden } = params ?? {};

            if (onHidden === undefined) {
                return;
            }

            if (!isUsingSplashScreen) {
                onHidden();
                return;
            }

            evtDisplayState.state.onHiddens.push(onHidden);
        }, []);

        const { showSplashScreen, hideSplashScreen } = (function useClosure() {
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
            useSplashScreenStatusInternal();

        return {
            isSplashScreenShown,
            isTransparencyEnabled,
            "hideRootSplashScreen": globalHideSplashScreen,
            showSplashScreen,
            hideSplashScreen,
        };
    }

    function useSplashScreenStatus() {
        const { isSplashScreenShown, isTransparencyEnabled } =
            useSplashScreenStatusInternal();

        useEffect(() => {
            if (isSplashScreenShown) {
                return;
            }

            const delayLeft =
                [
                    fadeOutDuration -
                        (Date.now() - evtDisplayState.state.prevTime),
                ].filter(v => v > 0)[0] ?? 0;

            let timer: ReturnType<typeof setTimeout>;

            (async () => {
                await new Promise(
                    resolve => (timer = setTimeout(resolve, delayLeft)),
                );

                evtDisplayState.state.onHiddens.forEach(onHidden => onHidden());

                evtDisplayState.state.onHiddens = [];
            })();

            return () => clearTimeout(timer);
        }, [isSplashScreenShown]);

        return { isSplashScreenShown, isTransparencyEnabled };
    }

    return { useSplashScreen, useSplashScreenStatus };
})();

export { useSplashScreen };

export type SplashScreenProps = {
    Logo: ReactComponent;
    /** Default 700ms */
    fadeOutDuration?: number;
    /** Default 1000 (1 second)*/
    minimumDisplayDuration?: number;
    children: ReactNode;
};

const context = createContext<boolean>(false);

export function createSplashScreen(params: { useTheme(): Theme }) {
    const { useTheme } = params;

    function SplashScreen(props: SplashScreenProps) {
        const { children, Logo } = props;

        if (props?.fadeOutDuration !== undefined) {
            fadeOutDuration = props.fadeOutDuration;
        }

        if (props?.minimumDisplayDuration !== undefined) {
            minimumDisplayDuration = props.minimumDisplayDuration;
        }

        const { isSplashScreenShown, isTransparencyEnabled } =
            useSplashScreenStatus();

        {
            const defaultOverflow = useConst(
                () => document.body.style.overflow,
            );

            useEffect(() => {
                document.body.style.overflow = isSplashScreenShown
                    ? "hidden"
                    : defaultOverflow;
            }, [isSplashScreenShown]);
        }

        const [isFadingOut, setIsFadingOut] = useState(false);
        const [isVisible, setIsVisible] = useState(true);

        const { classes } = useStyles({
            "theme": useTheme(),
            isVisible,
            isFadingOut,
            isTransparencyEnabled,
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
                            (timer = setTimeout(resolve, fadeOutDuration)),
                    );

                    setIsFadingOut(false);
                    setIsVisible(false);
                }
            })();

            return () => clearTimeout(timer);
        }, [isSplashScreenShown]);

        return (
            <context.Provider value={true}>
                <div className={classes.root}>
                    <Logo />
                </div>
                {children}
            </context.Provider>
        );
    }

    const useStyles = tss
        .withParams<{
            theme: Theme;
            isVisible: boolean;
            isFadingOut: boolean;
            isTransparencyEnabled: boolean;
        }>()
        .withName({ SplashScreen })
        .create(({ theme, isVisible, isFadingOut, isTransparencyEnabled }) => ({
            "root": {
                "width": "100%",
                "height": window.innerHeight,
                "position": "fixed",
                "top": 0,
                "left": 0,
                "zIndex": 10,
                "backgroundColor": (() => {
                    const color = new Color(
                        theme.colors.useCases.surfaces.background,
                    ).rgb();

                    return color
                        .alpha(
                            isTransparencyEnabled ? 0.6 : (color as any).valpha,
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
            },
        }));

    return { SplashScreen };
}

/**
 * You have to create your own version of this component
 * you are expected to size it in percentage.
 */
export function createOnyxiaSplashScreenLogo(params: { useTheme(): Theme }) {
    const { useTheme } = params;

    const OnyxiaSplashScreenLogo = memo(() => {
        const { classes } = useStyles({
            "theme": useTheme(),
        });

        return (
            <svg
                className={classes.root}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 445 293"
            >
                <g>
                    <path d="M106.253 215.9L140.204 250.02C151.012 260.883 168.528 260.883 179.322 250.02L213.273 215.9L159.763 162.123L106.253 215.9Z" />
                    <path d="M232.743 215.9L266.693 250.02C277.502 260.883 295.018 260.883 305.812 250.02L339.762 215.9L286.253 162.123L232.743 215.9Z" />
                </g>
                <g>
                    <path d="M43 152.331L76.9508 186.452C87.7594 197.314 105.275 197.314 116.069 186.452L150.02 152.331L96.5099 98.5537L43 152.331Z" />
                    <path d="M169.49 152.331L203.441 186.452C214.25 197.314 231.765 197.314 242.559 186.452L276.51 152.331L223 98.5537L169.49 152.331Z" />
                    <path d="M349.49 98.5537L295.98 152.331L329.931 186.452C340.74 197.314 358.256 197.314 369.049 186.452L403 152.331L349.49 98.5537Z" />
                </g>
                <g>
                    <path d="M232.743 88.7774L266.693 122.898C277.502 133.761 295.018 133.761 305.812 122.898L339.762 88.7774L286.253 35L232.743 88.7774Z" />
                    <path d="M106.253 88.7774L140.204 122.898C151.012 133.761 168.528 133.761 179.322 122.898L213.273 88.7774L159.763 35L106.253 88.7774Z" />
                </g>
            </svg>
        );
    });

    const useStyles = tss
        .withParams<{ theme: Theme }>()
        .withName({ OnyxiaSplashScreenLogo })
        .create(({ theme }) => ({
            "root": {
                "height": "20%",
                "fill": theme.colors.useCases.typography.textFocus,
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
        }));

    return { OnyxiaSplashScreenLogo };
}
