import { alpha } from "@mui/material/styles";

export const defaultPalette = {
    focus: {
        main: "#FE3711",
        light: "#FF562C",
        light2: "#FF9671",
        get mainAlpha20() {
            return alpha(this.main, 0.2);
        },
        get mainAlpha10() {
            return alpha(this.main, 0.1);
        },
    },
    dark: {
        main: "#22262F",
        light: "#2E333F",
        greyVariant1: "#1C1F27",
        greyVariant2: "#3A4352",
        greyVariant3: "#3A4352",
        greyVariant4: "#B0BCCD",
        greyVariant5: "#CBD2DD",
    },
    light: {
        main: "#ECEEF2",
        light: "#F6F7F9",
        greyVariant1: "#E2E5EB",
        greyVariant2: "#E2E5EB",
        greyVariant3: "#B0BCCD",
        greyVariant4: "#516078",
        greyVariant5: "#516078",
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
