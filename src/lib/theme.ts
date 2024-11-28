import {
    createTheme as createMuiTheme,
    unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
// cf https://mui.com/x/react-data-grid/getting-started/#typescript
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "./color";
import { defaultPalette, createDefaultColorUseCases } from "./color";
import type { GetTypographyDesc } from "./typography";
import {
    defaultGetTypographyDesc,
    createMuiTypographyOptions,
    getComputedTypography,
} from "./typography";
import { createMuiPaletteOptions } from "./color";
import { shadows } from "./shadows";
import { defaultSpacingConfig } from "./spacing";
import type { SpacingConfig, Spacing } from "./spacing";
import type { GetIconSizeInPx } from "./icon";
import { defaultGetIconSizeInPx, getIconSizesInPxByName } from "./icon";
import { breakpointsValues } from "./breakpoints";
import { capitalize } from "tsafe/capitalize";
import type { Theme as MuiTheme } from "@mui/material";
import type { ComputedTypography } from "./typography";
import type { IconSizeName } from "./icon";
import { useContext, createContext } from "react";
import { memoize } from "../tools/memoize";
import { alpha } from "@mui/material/styles";
import { type GridRowClassNameParams } from "@mui/x-data-grid";

export type Theme<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
> = {
    isDarkModeEnabled: boolean;
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
        getUseCases: (params: { isDarkModeEnabled: boolean }) => ColorUseCases;
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
    palette?: Palette;
    isReactStrictModeEnabled?: boolean;
    getTypographyDesc?: GetTypographyDesc<CustomTypographyVariantName>;
    createColorUseCases?: CreateColorUseCase<Palette, ColorUseCases>;
    spacingConfig?: SpacingConfig;
    getIconSizeInPx?: GetIconSizeInPx;
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

        const getUseCases_memoized = memoize((isDarkModeEnabled: boolean) =>
            createColorUseCases({
                palette,
                isDarkModeEnabled,
            }),
        );

        const spacing = (factorOrExplicitNumberOfPx: number | `${number}px`) =>
            spacingConfig({
                factorOrExplicitNumberOfPx,
                windowInnerWidth,
                rootFontSizePx: typographyDesc.rootFontSizePx,
            });

        return {
            colors: {
                palette,
                useCases,
                getUseCases: ({ isDarkModeEnabled }) =>
                    getUseCases_memoized(isDarkModeEnabled),
            },
            typography: getComputedTypography({ typographyDesc }),
            isDarkModeEnabled,
            shadows,
            ...(() => {
                const muiTheme = (
                    isReactStrictModeEnabled
                        ? unstable_createMuiStrictModeTheme
                        : createMuiTheme
                )({
                    // https://material-ui.com/customization/palette/#using-a-color-object
                    typography: createMuiTypographyOptions({
                        typographyDesc,
                    }),
                    palette: createMuiPaletteOptions({
                        isDarkModeEnabled,
                        palette,
                        useCases,
                    }),
                    spacing,
                    breakpoints: {
                        values: { xs: 0, ...breakpointsValues },
                    },
                    components: {
                        MuiLink: {
                            defaultProps: {
                                underline: "hover",
                            },
                        },
                        MuiDataGrid: {
                            styleOverrides: {
                                root: (() => {
                                    const set = new WeakSet<
                                        (
                                            params: GridRowClassNameParams,
                                        ) => string
                                    >();

                                    const borderNone = {
                                        border: "none",
                                        "--DataGrid-rowBorderColor":
                                            "transparent",
                                    };

                                    return (params: {
                                        ownerState?: {
                                            getRowClassName?: (
                                                params: GridRowClassNameParams,
                                            ) => string;
                                        };
                                    }) => {
                                        const { ownerState } = params;

                                        if (ownerState === undefined) {
                                            return borderNone;
                                        }

                                        if (
                                            ownerState.getRowClassName ===
                                                undefined ||
                                            !set.has(ownerState.getRowClassName)
                                        ) {
                                            const originalGetRowClassName =
                                                ownerState.getRowClassName;

                                            ownerState.getRowClassName =
                                                params => {
                                                    const {
                                                        indexRelativeToCurrentPage,
                                                    } = params;

                                                    const parityClassName =
                                                        indexRelativeToCurrentPage %
                                                            2 ===
                                                        0
                                                            ? "even"
                                                            : "odd";

                                                    const className =
                                                        originalGetRowClassName?.(
                                                            params,
                                                        );

                                                    return className ===
                                                        undefined
                                                        ? parityClassName
                                                        : `${parityClassName} ${className}`;
                                                };

                                            set.add(ownerState.getRowClassName);
                                        }
                                        return borderNone;
                                    };
                                })(),
                                row: () => {
                                    const hoveredAndSelected = {
                                        "&.Mui-hovered": {
                                            backgroundColor: alpha(
                                                useCases.typography.textFocus,
                                                0.6,
                                            ),
                                        },
                                        "&.Mui-selected": {
                                            backgroundColor: alpha(
                                                useCases.typography.textFocus,
                                                0.2,
                                            ),
                                        },
                                    };

                                    return {
                                        "&.even": {
                                            backgroundColor:
                                                useCases.surfaces.surface2,
                                            ...hoveredAndSelected,
                                        },
                                        "&.odd": {
                                            backgroundColor:
                                                useCases.surfaces.background,
                                            ...hoveredAndSelected,
                                        },
                                    };
                                },

                                cell: {
                                    border: "none",
                                },
                                withBorderColor: {
                                    borderColor: "transparent",
                                },
                            },
                        },
                    },
                });

                return {
                    spacing: (() => {
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
                            f({ axis: "horizontal", kind, value });
                        out.topBottom = (kind, value) =>
                            f({ axis: "vertical", kind, value });

                        return out;
                    })(),
                    muiTheme,
                };
            })(),
            iconSizesInPxByName: getIconSizesInPxByName({
                getIconSizeInPx,
                windowInnerWidth,
                rootFontSizePx: typographyDesc.rootFontSizePx,
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
        // If storybook
        if ("__STORYBOOK_ADDONS" in window) {
            // Storybook MDX is unrelyable, sometime the components gets rendered
            // without the decorator
            return getAllRedTheme() as T;
        }

        throw new Error(
            "Your app should be wrapped into <OnyxiaUi />. Cannot useTheme() here.",
        );
    }

    return theme as T;
}

const getAllRedTheme = memoize(() => {
    const { createTheme } = createThemeFactory({
        palette: JSON.parse(
            JSON.stringify(defaultPalette).replace(
                /"#[^"]"/g,
                `"${defaultPalette.redError.main}"`,
            ),
        ),
    });

    const theme = createTheme({
        isDarkModeEnabled: false,
        windowInnerWidth: window.innerWidth,
        rootFontSizePx: 16,
    });

    return theme;
});
