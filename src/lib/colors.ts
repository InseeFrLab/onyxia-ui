import { changeColorOpacity } from "../tools/changeColorOpacity";

import type { PaletteOptions as MuiPaletteOptions } from "@material-ui/core/styles/createPalette";
import type { Param0 } from "tsafe";

export type PaletteBase = typeof defaultPalette;
export type ColorUseCasesBase = ReturnType<typeof createDefaultColorUseCases>;

export type CreateColorUseCase<
    Palette extends PaletteBase,
    ColorUseCases extends ColorUseCasesBase,
> = (params: { isDarkModeEnabled: boolean; palette: Palette }) => ColorUseCases;

export const defaultPalette = {
    "focus": {
        "main": "#FF562C",
        "light": "#FFAD99",
        "light2": "#FFF2E5",
    },
    "dark": {
        "main": "#2C323F",
        "light": "#373E4F",
        "greyVariant1": "#242C39",
        "greyVariant2": "#5A6270",
        "greyVariant3": "#8A9099",
        "greyVariant4": "#B8BABF",
    },
    "light": {
        "main": "#F1F0EB",
        "light": "#FDFDFC",
        "greyVariant1": "#E6E6E6",
        "greyVariant2": "#C9C9C9",
        "greyVariant3": "#9E9E9E",
        "greyVariant4": "#747474",
    },
    "redError": {
        "main": "#CC0B0B",
        "light": "#FEECEB",
    },
    "greenSuccess": {
        "main": "#29CC2F",
        "light": "#EEFAEE",
    },
    "orangeWarning": {
        "main": "#FF8800",
        "light": "#FFF5E5",
    },
    "blueInfo": {
        "main": "#2196F3",
        "light": "#E9F5FE",
    },
};

export function createDefaultColorUseCases(params: Param0<CreateColorUseCase<PaletteBase, any>>) {
    const { isDarkModeEnabled, palette } = params;

    return {
        "typography": {
            "textPrimary": palette[isDarkModeEnabled ? "light" : "dark"].main,
            "textSecondary": palette[isDarkModeEnabled ? "dark" : "light"].greyVariant4,
            "textTertiary": palette[isDarkModeEnabled ? "dark" : "light"].greyVariant2,
            "textDisabled": palette[isDarkModeEnabled ? "dark" : "light"].greyVariant2,
            "textFocus": palette.focus.main,
        },
        "buttons": {
            "actionHoverPrimary": defaultPalette.focus.main,
            "actionHoverSecondary": isDarkModeEnabled
                ? defaultPalette.light.light
                : defaultPalette.dark.main,
            "actionHoverTernary": defaultPalette.light.main,
            "actionSelected": isDarkModeEnabled
                ? defaultPalette.dark.light
                : defaultPalette.light.greyVariant1,
            "actionActive": defaultPalette.focus.main,
            "actionDisabled": defaultPalette[isDarkModeEnabled ? "dark" : "light"].greyVariant3,
            "actionDisabledBackground":
                defaultPalette[isDarkModeEnabled ? "dark" : "light"].greyVariant1,
        },
        "surfaces": {
            "background": defaultPalette[isDarkModeEnabled ? "dark" : "light"].main,
            "surface1": defaultPalette[isDarkModeEnabled ? "dark" : "light"].light,
            "surface2": defaultPalette[isDarkModeEnabled ? "dark" : "light"].greyVariant1,
        },
        "alertSeverity": {
            "error": {
                "main": defaultPalette.redError.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": defaultPalette.redError.main,
                          "opacity": 0.2,
                      })
                    : defaultPalette.redError.light,
            },
            "success": {
                "main": defaultPalette.greenSuccess.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": defaultPalette.greenSuccess.main,
                          "opacity": 0.2,
                      })
                    : defaultPalette.greenSuccess.light,
            },
            "warning": {
                "main": defaultPalette.orangeWarning.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": defaultPalette.orangeWarning.main,
                          "opacity": 0.2,
                      })
                    : defaultPalette.orangeWarning.light,
            },
            "info": {
                "main": defaultPalette.blueInfo.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": defaultPalette.blueInfo.main,
                          "opacity": 0.2,
                      })
                    : defaultPalette.blueInfo.light,
            },
        },
    };
}

export function createMuiPaletteOptions(params: {
    isDarkModeEnabled: boolean;
    palette: PaletteBase;
    useCases: ColorUseCasesBase;
}): MuiPaletteOptions {
    const { isDarkModeEnabled, palette, useCases } = params;

    return {
        "type": isDarkModeEnabled ? "dark" : "light",
        "primary": {
            "main": palette.focus.main,
            "light": palette.focus.light,
        },
        "secondary": {
            "main": useCases.typography.textPrimary,
            "light": useCases.typography.textSecondary,
        },
        "error": {
            "light": useCases.alertSeverity.error.background,
            "main": useCases.alertSeverity.error.main,
            "contrastText": useCases.typography.textPrimary,
        },
        "success": {
            "light": useCases.alertSeverity.success.background,
            "main": useCases.alertSeverity.success.main,
            "contrastText": useCases.typography.textPrimary,
        },
        "info": {
            "light": useCases.alertSeverity.info.background,
            "main": useCases.alertSeverity.info.main,
            "contrastText": useCases.typography.textPrimary,
        },
        "warning": {
            "light": useCases.alertSeverity.warning.background,
            "main": useCases.alertSeverity.warning.main,
            "contrastText": useCases.typography.textPrimary,
        },
        "text": {
            "primary": useCases.typography.textPrimary,
            "secondary": useCases.typography.textSecondary,
            "disabled": useCases.typography.textDisabled,
            "hint": useCases.typography.textFocus,
        },
        "divider": useCases.buttons.actionDisabledBackground,
        "background": {
            "paper": useCases.surfaces.surface1,
            "default": useCases.surfaces.background,
        },
        "action": {
            "active": useCases.buttons.actionActive,
            "hover": useCases.buttons.actionHoverPrimary,
            "selected": useCases.buttons.actionSelected,
            "disabled": useCases.buttons.actionDisabled,
            "disabledBackground": useCases.buttons.actionDisabledBackground,
            "focus": useCases.typography.textFocus,
        },
    } as const;
}
