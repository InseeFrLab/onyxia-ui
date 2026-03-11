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
        greyVariant1: "#282D38",
        greyVariant2: "#465267",
        greyVariant3: "#7C8AA2",
        greyVariant4: "#C5CADE",
        greyVariant5: "#D0D4DA",
    },
    light: {
        main: "#F3F2F0",
        light: "#FDFDFC",
        greyVariant1: "#E9E9E9",
        greyVariant2: "#C5CADE",
        greyVariant3: "#9CA5B2",
        greyVariant4: "#6C778B",
        greyVariant5: "#4A5364",
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
