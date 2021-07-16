export type {
    PaletteBase,
    ColorUseCasesBase,
    CreateColorUseCase,
} from "./color";

export { defaultPalette, createDefaultColorUseCases } from "./color";

export * from "../tools/changeColorOpacity";

export type { Theme, ThemeProviderProps } from "./ThemeProvider";
export { createThemeProvider } from "./ThemeProvider";

export type {
    TypographyDesc,
    ComputedTypography,
    GetTypographyDesc,
} from "./typography";
export { defaultGetTypographyDesc } from "./typography";

export * from "./useIsDarkModeEnabled";

export type { Breakpoint, Responsive, ChromeFontSize } from "./responsive";
export { breakpointsValues, chromeFontSizesFactors } from "./responsive";

export {
    useDomRect,
    useWindowInnerSize,
    useBrowserFontSizeFactor,
} from "powerhooks";

export * from "../tools/getIsPortraitOrientation";
export { useSplashScreen } from "./SplashScreen";
