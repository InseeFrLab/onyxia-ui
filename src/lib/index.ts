export type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "./color";

export {
    defaultPalette,
    createDefaultColorUseCases,
    changeColorOpacity,
    useIsDarkModeEnabled,
    getIsDarkModeEnabledOsDefault,
    evtIsDarkModeEnabled,
} from "./color";

export type {
    TypographyDesc,
    ComputedTypography,
    GetTypographyDesc,
    ChromeFontSize,
} from "./typography";
export { defaultGetTypographyDesc, chromeFontSizesFactors } from "./typography";

export * from "./breakpoints";
export { breakpointsValues, getIsPortraitOrientation } from "./breakpoints";

export type { SpacingConfig } from "./spacing";
export { defaultSpacingConfig } from "./spacing";

export type { IconSizeName, GetIconSizeInPx } from "./icon";
export { defaultGetIconSizeInPx } from "./icon";

export { useSplashScreen } from "./SplashScreen";

export type { Theme, ThemeProviderProps } from "./ThemeProvider";
export {
    createThemeProvider,
    useDomRect,
    useWindowInnerSize,
    useBrowserFontSizeFactor,
    ViewPortOutOfRangeError,
} from "./ThemeProvider";

export { pxToNumber } from "../tools/pxToNumber";
