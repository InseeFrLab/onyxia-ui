import {
    useState,
    useEffect,
    useRef,
    useContext,
    createContext,
    type ReactNode,
} from "react";
import Color from "color";
import { useRerenderOnStateChange } from "evt/hooks";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { useConstCallback } from "powerhooks/useConstCallback";
import { tss } from "tss-react";
import type { Theme } from "./ThemeProvider";
import { Evt } from "evt";
import { id } from "tsafe/id";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import * as runExclusive from "run-exclusive";
import { useConst } from "powerhooks/useConst";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";
import { keyframes } from "tss-react";
import { ThemedImage } from "../ThemedImage";
import { ThemedAssetUrl } from "./ThemedAssetUrl";

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

export type SplashScreenParams = {
    /** If you want to change the size set the root width and/or height in percent. */
    assetUrl: ThemedAssetUrl;
    /** Default 700ms */
    fadeOutDuration?: number;
    /** Default 1000 (1 second)*/
    minimumDisplayDuration?: number;
    /** Default 1 */
    assetScaleFactor?: number;
};

const context = createContext<boolean>(false);

export function createSplashScreen(
    params: SplashScreenParams & { useTheme(): Theme },
) {
    const { assetUrl, useTheme, assetScaleFactor = 1 } = params;

    function SplashScreen(props: { children: ReactNode }) {
        const { children } = props;

        if (params?.fadeOutDuration !== undefined) {
            fadeOutDuration = params.fadeOutDuration;
        }

        if (params?.minimumDisplayDuration !== undefined) {
            minimumDisplayDuration = params.minimumDisplayDuration;
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

        const theme = useTheme();

        const { classes } = useStyles({
            theme,
            isVisible,
            isFadingOut,
            isTransparencyEnabled,
            assetScaleFactor,
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
                    {isVisible && (
                        <ThemedImage
                            className={classes.themedImage}
                            url={assetUrl}
                        />
                    )}
                </div>
                {children}
            </context.Provider>
        );
    }

    const getAnimation = (delay: string) =>
        `${keyframes`
    0% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
    60%, 100% {
        opacity: 0;
    }
    `} ${delay} infinite ease-in-out`;

    const useStyles = tss
        .withParams<{
            theme: Theme;
            isVisible: boolean;
            isFadingOut: boolean;
            isTransparencyEnabled: boolean;
            assetScaleFactor: number;
        }>()
        .withNestedSelectors<"themedImage">()
        .withName({ SplashScreen })
        .create(
            ({
                theme,
                isVisible,
                isFadingOut,
                isTransparencyEnabled,
                assetScaleFactor,
                classes,
            }) => ({
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
                    [`& svg.${classes.themedImage}`]: {
                        "&.splashscreen-animation": {
                            "opacity": 0,
                            "animation": getAnimation("3s"),
                            "animationDelay": "0.3s",
                        },
                        ...Object.fromEntries(
                            [".3s", ".7s", "1.1s"].map(
                                (animationDelay, index) => [
                                    `& .splashscreen-animation-group${
                                        index + 1
                                    }`,
                                    {
                                        "opacity": 0,
                                        "animation": getAnimation("3.5s"),
                                        animationDelay,
                                    },
                                ],
                            ),
                        ),
                    },
                    [`& img.${classes.themedImage}`]: {
                        "opacity": 0,
                        "animation": getAnimation("3s"),
                        "animationDelay": "0.3s",
                    },
                },
                "themedImage": {
                    "border": "1px solid red",
                    "height": `${
                        (console.log({ assetScaleFactor }), assetScaleFactor) *
                        15
                    }%`,
                },
            }),
        );

    return { SplashScreen };
}
