import {
    createTheme as createMuiTheme,
    unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
import type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "../color";
import { defaultPalette, createDefaultColorUseCases } from "../color";
import type { GetTypographyDesc } from "../typography";
import {
    defaultGetTypographyDesc,
    createMuiTypographyOptions,
    getComputedTypography,
} from "../typography";
import { createMuiPaletteOptions } from "../color";
import { shadows } from "../shadows";
import { defaultSpacingConfig } from "../spacing";
import type { SpacingConfig, Spacing } from "../spacing";
import type { GetIconSizeInPx } from "../icon";
import { defaultGetIconSizeInPx, getIconSizesInPxByName } from "../icon";
import { breakpointsValues } from "../breakpoints";
import { capitalize } from "tsafe/capitalize";
import type { Theme as MuiTheme } from "@mui/material";
import type { ComputedTypography } from "../typography";
import type { IconSizeName } from "../icon";
import { useContext, createContext } from "react";

export type Theme<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
> = {
    isDarkModeEnabled: boolean;
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
    };
    typography: ComputedTypography<CustomTypographyVariantName>;
    shadows: typeof shadows;
    spacing: Spacing;
    muiTheme: MuiTheme;
    iconSizesInPxByName: Record<IconSizeName, number>;
    windowInnerWidth: number;
};

export type ParamsOfCreateThemeFactory<
    Palette extends PaletteBase,
    ColorUseCases extends ColorUseCasesBase,
    CustomTypographyVariantName extends string,
> = {
    isReactStrictModeEnabled?: boolean;
    getTypographyDesc?: GetTypographyDesc<CustomTypographyVariantName>;
    palette?: Palette;
    createColorUseCases?: CreateColorUseCase<Palette, ColorUseCases>;
    spacingConfig?: SpacingConfig;
    getIconSizeInPx?: GetIconSizeInPx;
    publicUrl: string | undefined;
};

export function createThemeFactory<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
>(
    params: ParamsOfCreateThemeFactory<
        Palette,
        ColorUseCases,
        CustomTypographyVariantName
    >,
) {
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
        getIconSizeInPx = defaultGetIconSizeInPx,
    } = params;

    function createTheme(params: {
        isDarkModeEnabled: boolean;
        windowInnerWidth: number;
        rootFontSizePx: number;
    }): Theme<Palette, ColorUseCases, CustomTypographyVariantName> {
        const { isDarkModeEnabled, windowInnerWidth, rootFontSizePx } = params;

        const typographyDesc = getTypographyDesc({
            windowInnerWidth,
            rootFontSizePx,
        });
        const useCases = createColorUseCases({
            palette,
            isDarkModeEnabled,
        });

        const spacing = (factorOrExplicitNumberOfPx: number | `${number}px`) =>
            spacingConfig({
                factorOrExplicitNumberOfPx,
                windowInnerWidth,
                "rootFontSizePx": typographyDesc.rootFontSizePx,
            });

        return {
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

                            const { rightLeft, topBottom } = valueOrObject;

                            return [topBottom, rightLeft, topBottom, rightLeft]
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
        };
    }

    return {
        createTheme,
    };
}

export const themeContext = createContext<Theme | undefined>(undefined);

export function useTheme<T = Theme>(): T {
    const theme = useContext(themeContext);

    if (theme === undefined) {
        throw new Error("Your app should be wrapped into ThemeProvider");
    }

    return theme as T;
}
