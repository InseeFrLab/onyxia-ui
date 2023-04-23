import { changeColorOpacity } from "../tools/changeColorOpacity";
export * from "../tools/changeColorOpacity";

import type { PaletteOptions as MuiPaletteOptions } from "@mui/material/styles/createPalette";
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
        "light": "#FF562C",
        "light2": "#FFAD99",
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

export const francePalette: typeof defaultPalette = {
    ...defaultPalette,
    "focus": {
        "main": "#000091",
        "light": "#9A9AFF",
        "light2": "#E5E5F4",
    },
    "dark": {
        "main": "#2A2A2A",
        "light": "#383838",
        "greyVariant1": "#161616",
        "greyVariant2": "#9C9C9C",
        "greyVariant3": "#CECECE",
        "greyVariant4": "#E5E5E5",
    },
    "light": {
        "main": "#F1F0EB",
        "light": "#FDFDFC",
        "greyVariant1": "#E6E6E6",
        "greyVariant2": "#C9C9C9",
        "greyVariant3": "#9E9E9E",
        "greyVariant4": "#747474",
    },
};

export const casdPalette: typeof defaultPalette = {
    ...defaultPalette,
    "focus": {
        "main": "#000091",
        "light": "#9A9AFF",
        "light2": "#E5E5F4",
    },
    "dark": {
        "main": "#2A2A2A",
        "light": "#383838",
        "greyVariant1": "#161616",
        "greyVariant2": "#9C9C9C",
        "greyVariant3": "#CECECE",
        "greyVariant4": "#E5E5E5",
    },
    "light": {
        "main": "#F7F5F4",
        "light": "#FDFDFC",
        "greyVariant1": "#E6E6E6",
        "greyVariant2": "#C9C9C9",
        "greyVariant3": "#9E9E9E",
        "greyVariant4": "#747474",
    },
};

export const ultravioletPalette: typeof defaultPalette = {
    ...defaultPalette,
    "focus": {
        "main": "#067A76",
        "light": "#0AD6CF",
        "light2": "#AEE4E3",
    },
    "dark": {
        "main": "#2D1C3A",
        "light": "#4A3957",
        "greyVariant1": "#22122E",
        "greyVariant2": "#493E51",
        "greyVariant3": "#918A98",
        "greyVariant4": "#C0B8C6",
    },
    "light": {
        "main": "#F7F5F4",
        "light": "#FDFDFC",
        "greyVariant1": "#E6E6E6",
        "greyVariant2": "#C9C9C9",
        "greyVariant3": "#9E9E9E",
        "greyVariant4": "#747474",
    },
};

export const verdantPalette: typeof defaultPalette = {
    ...defaultPalette,
    "focus": {
        "main": "#1F8D49",
        "light": "#4efb8d",
        "light2": "#dffee6",
    },
    "light": {
        "main": "#F4F6FF",
        "light": "#F6F6F6",
        "greyVariant1": "#E6E6E6",
        "greyVariant2": "#C9C9C9",
        "greyVariant3": "#9E9E9E",
        "greyVariant4": "#747474",
    },
};

export function createDefaultColorUseCases(
    params: Param0<CreateColorUseCase<PaletteBase, any>>,
) {
    const { isDarkModeEnabled, palette } = params;

    return {
        "typography": {
            "textPrimary": palette[isDarkModeEnabled ? "light" : "dark"].main,
            "textSecondary":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant4,
            "textTertiary":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant2,
            "textDisabled":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant2,
            "textFocus": palette.focus[isDarkModeEnabled ? "light" : "main"],
        },
        "buttons": {
            "actionHoverPrimary":
                palette.focus[isDarkModeEnabled ? "light" : "main"],
            "actionHoverSecondary": isDarkModeEnabled
                ? palette.light.light
                : palette.dark.main,
            "actionHoverTernary": palette.light.main,
            "actionSelected": isDarkModeEnabled
                ? palette.dark.light
                : palette.light.greyVariant1,
            "actionActive": palette.focus[isDarkModeEnabled ? "light" : "main"],
            "actionDisabled":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant3,
            "actionDisabledBackground":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant1,
        },
        "surfaces": {
            "background": palette[isDarkModeEnabled ? "dark" : "light"].main,
            "surface1": palette[isDarkModeEnabled ? "dark" : "light"].light,
            "surface2":
                palette[isDarkModeEnabled ? "dark" : "light"].greyVariant1,
        },
        "alertSeverity": {
            "error": {
                "main": palette.redError.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": palette.redError.main,
                          "opacity": 0.2,
                      })
                    : palette.redError.light,
            },
            "success": {
                "main": palette.greenSuccess.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": palette.greenSuccess.main,
                          "opacity": 0.2,
                      })
                    : palette.greenSuccess.light,
            },
            "warning": {
                "main": palette.orangeWarning.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": palette.orangeWarning.main,
                          "opacity": 0.2,
                      })
                    : palette.orangeWarning.light,
            },
            "info": {
                "main": palette.blueInfo.main,
                "background": isDarkModeEnabled
                    ? changeColorOpacity({
                          "color": palette.blueInfo.main,
                          "opacity": 0.2,
                      })
                    : palette.blueInfo.light,
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
        "mode": isDarkModeEnabled ? "dark" : "light",
        "primary": {
            "main": palette.focus[isDarkModeEnabled ? "light" : "main"],
            "light": palette.focus.light2,
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
        },
        "divider": useCases.buttons.actionDisabledBackground,
        "background": {
            "paper": useCases.surfaces.surface1,
            "default": useCases.surfaces.background,
        },
        "action": {
            "active": useCases.buttons.actionActive,
            "hover": palette.focus.light,
            "selected": useCases.buttons.actionSelected,
            "disabled": useCases.buttons.actionDisabled,
            "disabledBackground": useCases.buttons.actionDisabledBackground,
            "focus": useCases.typography.textFocus,
        },
    } as const;
}
