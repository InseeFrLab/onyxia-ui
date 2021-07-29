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

export type { Breakpoint, Responsive } from "./responsive";
export { breakpointsValues, getIsPortraitOrientation } from "./responsive";

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

import { pxToNumber } from "../tools/pxToNumber";
