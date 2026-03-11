import { alpha } from "@mui/material/styles";

export const defaultPalette = {
    focus: {
        main: "#FF562C",
        light: "#FF562C",
        light2: "#FFAD99",
        get mainAlpha20() {
            return alpha(this.main, 0.2);
        },
        get mainAlpha10() {
            return alpha(this.main, 0.1);
        },
    },
    dark: {
        main: "#2C323F",
        light: "#373E4F",
        greyVariant1: "#6C778B",
        greyVariant2: "#99A0AB",
        greyVariant3: "#D0D4DA",
        greyVariant4: "#EAEAEA",
    },
    light: {
        main: "#F1F0EB",
        light: "#F3F2F0",
        greyVariant1: "#EAEAEA",
        greyVariant2: "#D0D4DA",
        greyVariant3: "#99A0AB",
        greyVariant4: "#6C778B",
    },
    redError: {
        main: "#CC0B0B",
        light: "#FEECEB",
    },
    greenSuccess: {
        main: "#29CC2F",
        light: "#EEFAEE",
    },
    orangeWarning: {
        main: "#FF8800",
        light: "#FFF5E5",
    },
    blueInfo: {
        main: "#2196F3",
        light: "#E9F5FE",
    },
};
