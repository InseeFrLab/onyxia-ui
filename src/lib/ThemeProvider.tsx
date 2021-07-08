/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { Theme as MuiTheme } from "@material-ui/core";
import { useIsDarkModeEnabled, evtIsDarkModeEnabled } from "./useIsDarkModeEnabled";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider as MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { createMuiTheme, unstable_createMuiStrictModeTheme } from "@material-ui/core/styles";
import { useWindowInnerSize } from "powerhooks";
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
import type { ZoomProviderProps } from "powerhooks";
import { useBrowserFontSizeFactor } from "powerhooks";
import { defaultSpacingConfig } from "./spacing";
import type { SpacingConfig } from "./spacing";

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
    spacingConfig?: SpacingConfig;
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
        spacingConfig = defaultSpacingConfig,
        custom = {} as NonNullable<typeof params["custom"]>,
        defaultIsDarkModeEnabled,
    } = params;

    if (defaultIsDarkModeEnabled !== undefined) {
        evtIsDarkModeEnabled.state = defaultIsDarkModeEnabled;
    }

    function useTheme(): Theme<Palette, ColorUseCases, CustomTypographyVariantName, Custom> {
        const { isDarkModeEnabled } = useIsDarkModeEnabled();
        const { windowInnerWidth } = useWindowInnerSize();
        const { browserFontSizeFactor } = useBrowserFontSizeFactor();

        const theme = useMemo((): Theme<Palette, ColorUseCases, CustomTypographyVariantName, Custom> => {
            const typographyDesc = getTypographyDesc({ windowInnerWidth, browserFontSizeFactor });

            const useCases = createColorUseCases({ palette, isDarkModeEnabled });

            return {
                "colors": { palette, useCases },
                "typography": getComputedTypography({ typographyDesc }),
                isDarkModeEnabled,
                shadows,
                "responsive": createResponsive({ windowInnerWidth }),
                ...(() => {
                    const muiTheme = (
                        isReactStrictModeEnabled ? unstable_createMuiStrictModeTheme : createMuiTheme
                    )({
                        // https://material-ui.com/customization/palette/#using-a-color-object
                        "typography": createMuiTypographyOptions({ typographyDesc }),
                        "palette": createMuiPaletteOptions({ isDarkModeEnabled, palette, useCases }),
                        "spacing": factor =>
                            spacingConfig({
                                factor,
                                windowInnerWidth,
                                "rootFontSizePx": typographyDesc.rootFontSizePx,
                            }),
                        "breakpoints": {
                            "values": { "xs": 0, ...breakpointsValues },
                        },
                    });

                    return {
                        "spacing": muiTheme.spacing.bind(muiTheme),
                        muiTheme,
                    };
                })(),
                custom,
            };
        }, [isDarkModeEnabled, windowInnerWidth, browserFontSizeFactor]);

        return theme;
    }

    const { ThemeProvider } = (() => {
        const { ThemeProviderInner } = (() => {
            function ThemeProviderInnerInner(props: {
                children: ReactNode;
                theme: Theme<Palette, ColorUseCases, CustomTypographyVariantName, Custom>;
            }) {
                const { children, theme } = props;

                const { setThemeBase } = useWrappedThemeBase();

                useEffect(() => {
                    setThemeBase(theme);
                }, [theme]);

                return (
                    <MuiThemeProvider theme={theme.muiTheme}>
                        <CssBaseline />
                        <StylesProvider injectFirst>{children}</StylesProvider>
                    </MuiThemeProvider>
                );
            }

            function ThemeProviderInner(props: { children: ReactNode }) {
                const { children } = props;

                const theme = useTheme();

                return (
                    <ThemeBaseProvider initialState={theme}>
                        <ThemeProviderInnerInner theme={theme}>{children}</ThemeProviderInnerInner>
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
