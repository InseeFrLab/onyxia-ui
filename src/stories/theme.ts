import "../assets/fonts/WorkSans/font.css";
import "../assets/fonts/Marianne/font.css";
import { createThemeProvider, defaultGetTypographyDesc } from "../lib";

import { ReactComponent as TourSvg } from "./assets/svg/Tour.svg";
import servicesSvgUrl from "./assets/svg/Services.svg";

const customIcons = {
    "tour": TourSvg,
    "services": servicesSvgUrl,
};

export type CustomIconId = keyof typeof customIcons;

export const { ThemeProvider, StoryProvider, useTheme } = createThemeProvider({
    "isReactStrictModeEnabled": false,
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": '"Work Sans", sans-serif',
        //"fontFamily": "Marianne, sans-serif",
    }),
    "publicUrl": process.env.NODE_ENV === "development" ? "" : "/onyxia-ui",
    customIcons,
});
