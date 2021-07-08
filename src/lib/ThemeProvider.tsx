/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Theme as MuiTheme } from "@material-ui/core";
import { useIsDarkModeEnabled, evtIsDarkModeEnabled } from "./useIsDarkModeEnabled";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider as MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { createMuiTheme, unstable_createMuiStrictModeTheme } from "@material-ui/core/styles";
import { useWindowInnerSize } from "powerhooks";
import memoize from "memoizee";
import { createObjectThatThrowsIfAccessed } from "../tools/createObjectThatThrowsIfAccessed";

import type { PaletteBase, ColorUseCasesBase, CreateColorUseCase } from "./colors";
import { defaultPalette, createDefaultColorUseCases } from "./colors";
import type { ComputedTypography, GetTypographyDesc } from "./typography";
import {
    defaultGetTypographyDesc,
    createMuiTypographyOptions,
    getComputedTypography,
} from "./typography";
import { createMuiPaletteOptions } from "./colors";
import { createUseScopedState } from "powerhooks";
import { createUseClassNamesFactory } from "tss-react";
import { shadows } from "./shadows";
import { ZoomProvider } from "powerhooks";
import { createResponsive, breakpointsValues } from "./responsive";
import type { Responsive } from "./responsive";
import { createText } from "../Text";
import { getWindowInnerSize } from "powerhooks";
import type { ZoomProviderProps } from "powerhooks";
import { useBrowserFontSizeFactor, getBrowserFontSizeFactor } from "powerhooks";

export type Theme<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
    Custom extends Record<string, unknown> = Record<string, unknown>,
> = {
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
    };
    isDarkModeEnabled: boolean;
    typography: ComputedTypography<CustomTypographyVariantName>;
    shadows: typeof shadows;
    spacing: MuiTheme["spacing"];
    muiTheme: MuiTheme;
    responsive: Responsive;
    custom: Custom;
};

const { ThemeBaseProvider, useThemeBase: useWrappedThemeBase } = createUseScopedState(
    "themeBase",
    createObjectThatThrowsIfAccessed<Theme>({
        "debugMessage": "Your app should be wrapped into ThemeProvider",
    }),
);

/** Used internally, not exported */
export const { createUseClassNames, useThemeBase, Text } = (() => {
    function useThemeBase() {
        const { themeBase } = useWrappedThemeBase();
        return themeBase;
    }

    const { createUseClassNames } = createUseClassNamesFactory({ "useTheme": useThemeBase });

    const { Text } = createText({ "useTheme": useThemeBase });

    return { createUseClassNames, useThemeBase, Text };
})();

export type ThemeProviderProps = {
    children: ReactNode;
    getZoomConfig?: ZoomProviderProps["getConfig"];
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
    Custom extends Record<string, unknown> = Record<string, unknown>,
>(params: {
    isReactStrictModeEnabled?: boolean;
    getTypographyDesc?: GetTypographyDesc<CustomTypographyVariantName>;
    palette?: Palette;
    createColorUseCases?: CreateColorUseCase<Palette, ColorUseCases>;
    spacingSteps?(factor: number): number;
    custom?: Custom;
    defaultIsDarkModeEnabled?: boolean;
}) {
    const {
        palette = defaultPalette as NonNullable<typeof params["palette"]>,
        createColorUseCases = createDefaultColorUseCases as unknown as NonNullable<
            typeof params["createColorUseCases"]
        >,
        getTypographyDesc = defaultGetTypographyDesc as NonNullable<typeof params["getTypographyDesc"]>,
        isReactStrictModeEnabled = false,
        spacingSteps = factor => 8 * factor,
        custom = {} as NonNullable<typeof params["custom"]>,
        defaultIsDarkModeEnabled,
    } = params;

    if (defaultIsDarkModeEnabled !== undefined) {
        evtIsDarkModeEnabled.state = defaultIsDarkModeEnabled;
    }

    const createColorUseCases_memo = memoize(
        (isDarkModeEnabled: boolean) => createColorUseCases({ palette, isDarkModeEnabled }),
        //NOTE: Max 1 because a bug in MUI4 forces us to provide a new ref of the theme
        //each time we switches or we end up with colors bugs.
        { "max": 1 },
    );

    const createMuiTheme_memo = memoize(
        (isDarkModeEnabled: boolean, windowInnerWidth: number, browserFontSizeFactor: number) =>
            //https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
            (isReactStrictModeEnabled ? unstable_createMuiStrictModeTheme : createMuiTheme)({
                // https://material-ui.com/customization/palette/#using-a-color-object
                "typography": createMuiTypographyOptions({
                    "typographyDesc": getTypographyDesc({ windowInnerWidth, browserFontSizeFactor }),
                }),
                "palette": createMuiPaletteOptions({
                    isDarkModeEnabled,
                    palette,
                    "useCases": createColorUseCases_memo(isDarkModeEnabled),
                }),
                "spacing": spacingSteps,
                "breakpoints": {
                    "values": { "xs": 0, ...breakpointsValues },
                },
            }),
        { "max": 1 },
    );

    const createTheme_memo = memoize(
        (
            isDarkModeEnabled: boolean,
            windowInnerWidth: number,
            browserFontSizeFactor: number,
        ): Theme<Palette, ColorUseCases, CustomTypographyVariantName, Custom> => ({
            "colors": {
                palette,
                "useCases": createColorUseCases_memo(isDarkModeEnabled),
            },
            "typography": getComputedTypography({
                "typographyDesc": getTypographyDesc({ windowInnerWidth, browserFontSizeFactor }),
            }),
            isDarkModeEnabled,
            shadows,
            "responsive": createResponsive({ windowInnerWidth }),
            ...(() => {
                const muiTheme = createMuiTheme_memo(
                    isDarkModeEnabled,
                    windowInnerWidth,
                    browserFontSizeFactor,
                );
                return {
                    "spacing": muiTheme.spacing.bind(muiTheme),
                    muiTheme,
                };
            })(),
            custom,
        }),
        { "max": 1 },
    );

    function useTheme(): Theme<Palette, ColorUseCases, CustomTypographyVariantName, Custom> {
        const { isDarkModeEnabled } = useIsDarkModeEnabled();
        const { windowInnerWidth } = useWindowInnerSize();
        const { browserFontSizeFactor } = useBrowserFontSizeFactor();

        return createTheme_memo(isDarkModeEnabled, windowInnerWidth, browserFontSizeFactor);
    }

    const { ThemeProvider } = (() => {
        const { ThemeProviderInner } = (() => {
            function ThemeProviderInnerInner(props: { children: ReactNode }) {
                const { children } = props;

                const theme = useTheme();

                const { setThemeBase } = useWrappedThemeBase();

                useEffect(() => {
                    setThemeBase(theme);
                }, [theme]);

                return (
                    <MuiThemeProvider
                        theme={createMuiTheme_memo(
                            theme.isDarkModeEnabled,
                            theme.responsive.windowInnerWidth,
                            getBrowserFontSizeFactor(),
                        )}
                    >
                        <CssBaseline />
                        <StylesProvider injectFirst>{children}</StylesProvider>
                    </MuiThemeProvider>
                );
            }

            function ThemeProviderInner(props: { children: ReactNode }) {
                const { children } = props;

                //NOTE: It's a shame that we have to do all that just to
                //initialize for a few ms
                const [initialState] = useState(() =>
                    createTheme_memo(
                        evtIsDarkModeEnabled.state,
                        getWindowInnerSize().windowInnerWidth,
                        getBrowserFontSizeFactor(),
                    ),
                );

                return (
                    <ThemeBaseProvider initialState={initialState}>
                        <ThemeProviderInnerInner>{children}</ThemeProviderInnerInner>
                    </ThemeBaseProvider>
                );
            }

            return { ThemeProviderInner };
        })();

        const ThemeProvider = (props: ThemeProviderProps) => {
            const { getZoomConfig } = props;

            const children = <ThemeProviderInner>{props.children}</ThemeProviderInner>;

            return getZoomConfig === undefined ? (
                children
            ) : (
                <ZoomProvider getConfig={getZoomConfig}>{children}</ZoomProvider>
            );
        };

        return { ThemeProvider };
    })();

    return { ThemeProvider, useTheme };
}
