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
import { createTss } from "tss-react";
import type { IconSizeName, GetIconSizeInPx } from "./icon";
import { defaultGetIconSizeInPx, getIconSizesInPxByName } from "./icon";
import { createSplashScreen } from "./SplashScreen";
import type { SplashScreenProps } from "./SplashScreen";
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
};

const themeBaseContext = createContext<Theme | undefined>(undefined);
const isDarkModeEnabledOverrideContext = createContext<boolean | undefined>(
    undefined,
);

/** Used internally, do not export globally */

export function useIsThemeProvided(): boolean {
    const theme = useContext(themeBaseContext);

    return theme !== undefined;
}

function useThemeBase() {
    const theme = useContext(themeBaseContext);

    if (theme === undefined) {
        throw new Error("Your app should be wrapped into ThemeProvider");
    }

    return theme;
}

export const { tss } = createTss({
    "useContext": function useContext() {
        const theme = useThemeBase();
        return { theme };
    },
});

export const useStyles = tss.create({});

export type ThemeProviderProps = {
    children: ReactNode;
    splashScreen?: Omit<SplashScreenProps, "children">;
};

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
    /** Default true */
}) {
    const {
        palette = defaultPalette as NonNullable<typeof params["palette"]>,
        createColorUseCases = createDefaultColorUseCases as unknown as NonNullable<
            typeof params["createColorUseCases"]
        >,
        getTypographyDesc = defaultGetTypographyDesc as NonNullable<
            typeof params["getTypographyDesc"]
        >,
        isReactStrictModeEnabled = false,
        spacingConfig = defaultSpacingConfig,
        defaultIsDarkModeEnabled,
        getIconSizeInPx = defaultGetIconSizeInPx,
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

    const { SplashScreen } = createSplashScreen({ useTheme });

    const { ThemeProvider } = (() => {
        function ThemeProviderWithinViewPortAdapter(props: {
            splashScreen: ThemeProviderProps["splashScreen"];
            children: ReactNode;
        }) {
            const { splashScreen, children } = props;

            const theme = useTheme();

            {
                const backgroundColor =
                    theme.colors.useCases.surfaces.background;

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

            // prettier-ignore
            const SplashScreenOrId = useGuaranteedMemo(
                (): ReactComponent<{ children: ReactNode }> =>
                    splashScreen === undefined ?
                        (({ children }) => <>{children}</>) :
                        (({ children }) => <SplashScreen {...splashScreen}>{children}</SplashScreen>),
                [splashScreen],
            );

            return (
                <themeBaseContext.Provider value={theme}>
                    <MuiThemeProvider theme={theme.muiTheme}>
                        <CssBaselineOrScopedCssBaseline>
                            <SplashScreenOrId>{children}</SplashScreenOrId>
                        </CssBaselineOrScopedCssBaseline>
                    </MuiThemeProvider>
                </themeBaseContext.Provider>
            );
        }

        function ThemeProvider(props: ThemeProviderProps) {
            const { children, splashScreen } = props;

            return (
                <ThemeProviderWithinViewPortAdapter splashScreen={splashScreen}>
                    {children}
                </ThemeProviderWithinViewPortAdapter>
            );
        }

        return { ThemeProvider };
    })();

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

    const { tss } = createTss({
        "useContext": function useContext() {
            const theme = useTheme();
            return { theme };
        },
    });

    const useStyles = tss.create({});

    return {
        ThemeProvider,
        useTheme,
        StoryProvider,
        tss,
        useStyles,
    };
}
