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

export {
    type ThemedAssetUrl,
    resolveThemedAssetUrl,
    useResolveThemedAssetUrl,
} from "./ThemedAssetUrl";

export type { Theme } from "./theme";
export { useTheme } from "./theme";
export { useDarkMode } from "./darkMode";
export { createOnyxiaUi } from "./OnyxiaUi";
export { useSplashScreen } from "./SplashScreen";

export { pxToNumber } from "../tools/pxToNumber";
