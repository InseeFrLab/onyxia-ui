export type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "./color";

export {
    defaultPalette,
    francePalette,
    ultravioletPalette,
    verdantPalette,
    createDefaultColorUseCases,
    changeColorOpacity,
} from "./color";

export { getIsDarkModeEnabledOsDefault } from "../tools/getIsDarkModeEnabledOsDefault";

export {
    useIsDarkModeEnabled,
    evtIsDarkModeEnabled,
} from "./useIsDarkModeEnabled";

export type {
    TypographyDesc,
    ComputedTypography,
    GetTypographyDesc,
} from "./typography";
export { defaultGetTypographyDesc } from "./typography";

export * from "./breakpoints";
export { breakpointsValues } from "./breakpoints";

export type { SpacingConfig, Spacing } from "./spacing";
export { defaultSpacingConfig } from "./spacing";

export type { IconSizeName, GetIconSizeInPx } from "./icon";
export { defaultGetIconSizeInPx } from "./icon";

export { useSplashScreen } from "./SplashScreen";

export {
    type ThemedAssetUrl,
    resolveAssetVariantUrl,
    useResolveAssetVariantUrl,
} from "./ThemedAssetUrl";

export type { Theme, ThemeProviderProps } from "./ThemeProvider";
export { createThemeProvider, useTheme } from "./ThemeProvider";

export { pxToNumber } from "../tools/pxToNumber";
