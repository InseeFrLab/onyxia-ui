import type { Theme } from "@material-ui/core";
import { useIsDarkModeEnabled, evtIsDarkModeEnabled } from "./useIsDarkModeEnabled";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider as MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { createMuiTheme, unstable_createMuiStrictModeTheme } from "@material-ui/core/styles";
import { responsiveFontSizes } from "@material-ui/core/styles";
import memoize from "memoizee";
import { createObjectThatThrowsIfAccessed } from "../tools/createObjectThatThrowsIfAccessed";

import type { PaletteBase, ColorUseCasesBase, CreateColorUseCase } from "./colors";
import { defaultPalette, createDefaultColorUseCases } from "./colors";
import type { TypographyOptionsBase } from "./typography";
import { defaultTypography, createMuiTypographyOptions } from "./typography";
import { createMuiPaletteOptions } from "./colors";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { createUseClassNamesFactory } from "tss-react";
import { shadows } from "./shadows";

export type OnyxiaTheme<
    Palette extends PaletteBase,
    ColorUseCases extends ColorUseCasesBase,
    TypographyOptions extends TypographyOptionsBase,
    Custom extends Record<string, unknown>,
> = {
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
    };
    isDarkModeEnabled: boolean;
    typography: TypographyOptions;
    shadows: typeof shadows;
    spacing: Theme["spacing"];
    muiTheme: Theme;
    custom: Custom;
};

const { useOnyxiaThemeBase, evtOnyxiaThemeBase } = createUseGlobalState(
    "onyxiaThemeBase",
    //NOTE We should be able to use Record<string, never> as Custom here...
    createObjectThatThrowsIfAccessed<
        OnyxiaTheme<PaletteBase, ColorUseCasesBase, TypographyOptionsBase, Record<string, unknown>>
    >({
        "debugMessage": "You must invoke createThemeProvider() before being able to use the components",
    }),
    { "persistance": false },
);

export const { createUseClassNames } = createUseClassNamesFactory({
    "useTheme": function useClosure() {
        const { onyxiaThemeBase } = useOnyxiaThemeBase();
        return onyxiaThemeBase;
    },
});

export function createThemeProvider<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    TypographyOptions extends TypographyOptionsBase = TypographyOptionsBase,
    Custom extends Record<string, unknown> = Record<string, never>,
>(params: {
    isReactStrictModeEnabled?: boolean;
    typography?: TypographyOptions;
    palette?: Palette;
    createColorUseCases?: CreateColorUseCase<Palette, ColorUseCases>;
    spacingSteps?(factor: number): number;
    custom?: Custom;
}) {
    const {
        palette = defaultPalette as NonNullable<typeof params["palette"]>,
        createColorUseCases = createDefaultColorUseCases as unknown as NonNullable<
            typeof params["createColorUseCases"]
        >,
        typography = defaultTypography as NonNullable<typeof params["typography"]>,
        isReactStrictModeEnabled = false,
        spacingSteps = factor => 8 * factor,
        custom = {} as NonNullable<typeof params["custom"]>,
    } = params;

    const createColorUseCases_memo = memoize(
        (isDarkModeEnabled: boolean) => createColorUseCases({ palette, isDarkModeEnabled }),
        //NOTE: Max 1 because a bug in MUI4 forces us to provide a new ref of the theme
        //each time we switches or we end up with colors bugs.
        { "max": 1 },
    );

    const createMuiTheme_memo = memoize(
        (isDarkModeEnabled: boolean) =>
            responsiveFontSizes(
                //https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
                (isReactStrictModeEnabled ? unstable_createMuiStrictModeTheme : createMuiTheme)({
                    // https://material-ui.com/customization/palette/#using-a-color-object
                    "typography": createMuiTypographyOptions({ typography }),
                    "palette": createMuiPaletteOptions({
                        isDarkModeEnabled,
                        palette,
                        "useCases": createColorUseCases_memo(isDarkModeEnabled),
                    }),
                    "spacing": spacingSteps,
                }),
            ),
        { "max": 1 },
    );

    function OnyxiaThemeProvider(props: { children: React.ReactNode }) {
        const { children } = props;

        const { isDarkModeEnabled } = useIsDarkModeEnabled();

        return (
            <MuiThemeProvider theme={createMuiTheme_memo(isDarkModeEnabled)}>
                <CssBaseline />
                <StylesProvider injectFirst>{children}</StylesProvider>
            </MuiThemeProvider>
        );
    }

    const createOnyxiaTheme_memo = memoize(
        (isDarkModeEnabled): OnyxiaTheme<Palette, ColorUseCases, TypographyOptions, Custom> => ({
            "colors": {
                palette,
                "useCases": createColorUseCases_memo(isDarkModeEnabled),
            },
            typography,
            isDarkModeEnabled,
            shadows,
            ...(() => {
                const muiTheme = createMuiTheme_memo(isDarkModeEnabled);

                return {
                    "spacing": muiTheme.spacing,
                    muiTheme,
                };
            })(),
            custom,
        }),
        { "max": 1 },
    );

    evtIsDarkModeEnabled.attach(
        isDarkModeEnabled => (evtOnyxiaThemeBase.state = createOnyxiaTheme_memo(isDarkModeEnabled)),
    );

    function useOnyxiaTheme(): OnyxiaTheme<Palette, ColorUseCases, TypographyOptions, Custom> {
        const { isDarkModeEnabled } = useIsDarkModeEnabled();

        return createOnyxiaTheme_memo(isDarkModeEnabled);
    }

    return { OnyxiaThemeProvider, useOnyxiaTheme };
}
