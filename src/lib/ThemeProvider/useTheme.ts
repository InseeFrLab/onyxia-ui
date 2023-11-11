import { useContext, createContext } from "react";
import type { Theme as MuiTheme } from "@mui/material";
import type { PaletteBase, ColorUseCasesBase } from "../color";
import type { ComputedTypography } from "../typography";
import type { shadows } from "../shadows";
import type { Spacing } from "../spacing";
import type { IconSizeName } from "../icon";

export type Theme<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
> = {
    colors: {
        palette: Palette;
        useCases: ColorUseCases;
    };
    isDarkModeEnabled: boolean;
    typography: ComputedTypography<CustomTypographyVariantName>;
    shadows: typeof shadows;
    spacing: Spacing;
    muiTheme: MuiTheme;
    iconSizesInPxByName: Record<IconSizeName, number>;
    windowInnerWidth: number;
    publicUrl: string | undefined;
};

export const themeContext = createContext<Theme | undefined>(undefined);

export function useTheme<T = Theme>(): T {
    const theme = useContext(themeContext);

    if (theme === undefined) {
        throw new Error("Your app should be wrapped into ThemeProvider");
    }

    return theme as T;
}
