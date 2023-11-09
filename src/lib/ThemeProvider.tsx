import "minimal-polyfills/Object.fromEntries";
import { useContext, createContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Theme as MuiTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
    createTheme as createMuiTheme,
    unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "./color";
import { defaultPalette, createDefaultColorUseCases } from "./color";
import type { ComputedTypography, GetTypographyDesc } from "./typography";
import {
    defaultGetTypographyDesc,
    createMuiTypographyOptions,
    getComputedTypography,
} from "./typography";
import { createMuiPaletteOptions } from "./color";
import { shadows } from "./shadows";
import { defaultSpacingConfig } from "./spacing";
import type { SpacingConfig, Spacing } from "./spacing";
import type { IconSizeName, GetIconSizeInPx } from "./icon";
import { defaultGetIconSizeInPx, getIconSizesInPxByName } from "./icon";
import { createSplashScreen, type SplashScreenParams } from "./SplashScreen";
import { id } from "tsafe/id";
import { breakpointsValues } from "./breakpoints";
import { capitalize } from "tsafe/capitalize";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import {
    useIsDarkModeEnabled,
    evtIsDarkModeEnabled,
} from "./useIsDarkModeEnabled";
import { useRootFontSizePx } from "../tools/useRootFontSizePx";
import { memoize } from "../tools/memoize";
import { Reflect } from "tsafe/Reflect";

import type { ReactComponent } from "../tools/ReactComponent";

export type Theme<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
> = {
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
    };
    isDarkModeEnabled: boolean;
    typography: ComputedTypography<CustomTypographyVariantName>;
    shadows: typeof shadows;
    spacing: Spacing;
    muiTheme: MuiTheme;
    iconSizesInPxByName: Record<IconSizeName, number>;
    windowInnerWidth: number;
    publicUrl: string | undefined;
};

const themeContext = createContext<Theme | undefined>(undefined);

export function useTheme<T = Theme>(): T {
    const theme = useContext(themeContext);

    if (theme === undefined) {
        throw new Error("Your app should be wrapped into ThemeProvider");
    }

    return theme as T;
}

// NOTE: Only For Storybook
const isDarkModeEnabledOverrideContext = createContext<boolean | undefined>(
    undefined,
);

export declare namespace ThemeProviderProps {
    type WithChildren = {
        children: ReactNode;
    };

    export type WithZoom = {
        zoomProviderReferenceWidth?: number;

        /**
         * Message to display when portrait mode, example:
         *    This app isn't compatible with landscape mode yet,
         *    please enable the rotation sensor and flip your phone.
         */
        portraitModeUnsupportedMessage?: ReactNode;
    } & WithChildren;

    export type WithoutZoom = WithChildren;
}

/**
 * publicUrl:
 *
 * If you do not use the copy-material-icons-to-public script, you can set publicUrl to undefined.
 *
 * If your site is hosted by navigating to `https://www.example.com`
 * set publicUrl to ""
 * If your site is hosted by navigating to `https://www.example.com/my-app`
 * Then you want to set publicUrl to `/my-app`
 *
 * Be mindful that `${window.location.origin}${publicUrl}/material-icons/xxx.svg` must resolve
 * to the icon that have been automatically copied in your public folder.
 *
 * If your are still using `create-react-app` you can just set
 * publicUrl to `process.env.PUBLIC_URL` and don't have to think about it further.
 */
export function createThemeProvider<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
>(params: {
    isReactStrictModeEnabled?: boolean;
    getTypographyDesc?: GetTypographyDesc<CustomTypographyVariantName>;
    palette?: Palette;
    createColorUseCases?: CreateColorUseCase<Palette, ColorUseCases>;
    spacingConfig?: SpacingConfig;
    defaultIsDarkModeEnabled?: boolean;
    getIconSizeInPx?: GetIconSizeInPx;
    /** If undefined, splash screen is disabled */
    splashScreenParams?: SplashScreenParams;
    publicUrl: string | undefined;
    leftBarParams?: {
        defaultIsPanelOpen: boolean;
        persistIsPanelOpen: boolean;
    };
}) {
    const {
        palette = defaultPalette as NonNullable<(typeof params)["palette"]>,
        createColorUseCases = createDefaultColorUseCases as unknown as NonNullable<
            (typeof params)["createColorUseCases"]
        >,
        getTypographyDesc = defaultGetTypographyDesc as NonNullable<
            (typeof params)["getTypographyDesc"]
        >,
        isReactStrictModeEnabled = false,
        spacingConfig = defaultSpacingConfig,
        defaultIsDarkModeEnabled,
        getIconSizeInPx = defaultGetIconSizeInPx,
        splashScreenParams,
        publicUrl,
    } = params;

    if (defaultIsDarkModeEnabled !== undefined) {
        evtIsDarkModeEnabled.state = defaultIsDarkModeEnabled;
    }

    const { useTheme } = (() => {
        const createTheme = memoize(
            (
                isDarkModeEnabled: boolean,
                windowInnerWidth: number,
                rootFontSizePx: number,
            ) => {
                const typographyDesc = getTypographyDesc({
                    windowInnerWidth,
                    rootFontSizePx,
                });
                const useCases = createColorUseCases({
                    palette,
                    isDarkModeEnabled,
                });

                const spacing = (
                    factorOrExplicitNumberOfPx: number | `${number}px`,
                ) =>
                    spacingConfig({
                        factorOrExplicitNumberOfPx,
                        windowInnerWidth,
                        "rootFontSizePx": typographyDesc.rootFontSizePx,
                    });

                return id<
                    Theme<Palette, ColorUseCases, CustomTypographyVariantName>
                >({
                    "colors": { palette, useCases },
                    "typography": getComputedTypography({ typographyDesc }),
                    isDarkModeEnabled,
                    shadows,
                    ...(() => {
                        const muiTheme = (
                            isReactStrictModeEnabled
                                ? unstable_createMuiStrictModeTheme
                                : createMuiTheme
                        )({
                            // https://material-ui.com/customization/palette/#using-a-color-object
                            "typography": createMuiTypographyOptions({
                                typographyDesc,
                            }),
                            "palette": createMuiPaletteOptions({
                                isDarkModeEnabled,
                                palette,
                                useCases,
                            }),
                            spacing,
                            "breakpoints": {
                                "values": { "xs": 0, ...breakpointsValues },
                            },
                            "components": {
                                "MuiLink": {
                                    "defaultProps": {
                                        "underline": "hover",
                                    },
                                },
                            },
                        });

                        return {
                            "spacing": (() => {
                                const toFinalValue = (value: number | string) =>
                                    typeof value === "number"
                                        ? `${spacing(value)}px`
                                        : value;

                                const out = ((
                                    valueOrObject:
                                        | number
                                        | Record<
                                              "topBottom" | "rightLeft",
                                              number | string
                                          >,
                                ): string | number => {
                                    if (typeof valueOrObject === "number") {
                                        return spacing(valueOrObject);
                                    }

                                    const { rightLeft, topBottom } =
                                        valueOrObject;

                                    return [
                                        topBottom,
                                        rightLeft,
                                        topBottom,
                                        rightLeft,
                                    ]
                                        .map(toFinalValue)
                                        .join(" ");
                                }) as any as Spacing;

                                const f = (params: {
                                    axis: "vertical" | "horizontal";
                                    kind: "padding" | "margin";
                                    value: number | string;
                                }): Record<string, string> => {
                                    const { axis, kind, value } = params;

                                    const finalValue =
                                        typeof value === "number"
                                            ? `${spacing(value)}px`
                                            : value;

                                    return Object.fromEntries(
                                        (() => {
                                            switch (axis) {
                                                case "horizontal":
                                                    return ["left", "right"];
                                                case "vertical":
                                                    return ["top", "bottom"];
                                            }
                                        })().map(direction => [
                                            `${kind}${capitalize(direction)}`,
                                            finalValue,
                                        ]),
                                    );
                                };

                                out.rightLeft = (kind, value) =>
                                    f({ "axis": "horizontal", kind, value });
                                out.topBottom = (kind, value) =>
                                    f({ "axis": "vertical", kind, value });

                                return out;
                            })(),
                            muiTheme,
                        };
                    })(),
                    "iconSizesInPxByName": getIconSizesInPxByName({
                        getIconSizeInPx,
                        windowInnerWidth,
                        "rootFontSizePx": typographyDesc.rootFontSizePx,
                    }),
                    windowInnerWidth,
                    publicUrl,
                });
            },
            { "max": 1 },
        );

        function useTheme() {
            const { isDarkModeEnabled } = useIsDarkModeEnabled();
            const { windowInnerWidth } = useWindowInnerSize();

            const isDarkModeEnabledOverride = useContext(
                isDarkModeEnabledOverrideContext,
            );

            const { rootFontSizePx } = useRootFontSizePx();

            return createTheme(
                isDarkModeEnabledOverride ?? isDarkModeEnabled,
                windowInnerWidth,
                rootFontSizePx,
            );
        }

        return { useTheme };
    })();

    const MaybeSplashScreen =
        splashScreenParams === undefined
            ? ({ children }: { children: ReactNode }) => <>{children}</>
            : createSplashScreen({
                  useTheme,
                  "Logo": splashScreenParams.Logo,
                  "fadeOutDuration": splashScreenParams.fadeOutDuration,
                  "minimumDisplayDuration":
                      splashScreenParams.minimumDisplayDuration,
              }).SplashScreen;

    function ThemeProvider(props: { children: ReactNode }) {
        const { children } = props;

        const theme = useTheme();

        {
            const backgroundColor = theme.colors.useCases.surfaces.background;

            useEffect(() => {
                document.documentElement.style.backgroundColor =
                    backgroundColor;

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const element = document.querySelector(
                        "meta[name=theme-color]",
                    );

                    if (element === null) {
                        break;
                    }

                    element.remove();
                }

                document.head.insertAdjacentHTML(
                    "beforeend",
                    `<meta name="theme-color" content="${backgroundColor}">`,
                );
            }, [backgroundColor]);
        }

        const isStoryProvider =
            useContext(isDarkModeEnabledOverrideContext) !== undefined;

        // prettier-ignore
        const CssBaselineOrScopedCssBaseline = useGuaranteedMemo(
            (): ReactComponent<{ children: ReactNode }> =>
                isStoryProvider
                    ? ({ children }) => (<ScopedCssBaseline>{children}</ScopedCssBaseline>)
                    : ({ children }) => (<><CssBaseline />{children}</>),
            [isStoryProvider],
        );

        return (
            <themeContext.Provider value={theme}>
                <MuiThemeProvider theme={theme.muiTheme}>
                    <CssBaselineOrScopedCssBaseline>
                        <MaybeSplashScreen>{children}</MaybeSplashScreen>
                    </CssBaselineOrScopedCssBaseline>
                </MuiThemeProvider>
            </themeContext.Provider>
        );
    }

    function StoryProvider(props: { dark?: boolean; children: ReactNode }) {
        const { dark = false, children } = props;

        useEffect(() => {
            evtIsDarkModeEnabled.state = dark;
        }, [dark]);

        return (
            <isDarkModeEnabledOverrideContext.Provider value={dark}>
                <ThemeProvider>{children}</ThemeProvider>
            </isDarkModeEnabledOverrideContext.Provider>
        );
    }

    return {
        ThemeProvider,
        ofTypeTheme: Reflect<ReturnType<typeof useTheme>>(),
        StoryProvider,
    };
}
