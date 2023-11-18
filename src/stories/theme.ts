import "../assets/fonts/WorkSans/font.css";
import "../assets/fonts/Marianne/font.css";
import { createThemeProvider, defaultGetTypographyDesc } from "../lib";

import tourSvgUrl from "./assets/svg/Tour.svg";
import servicesSvgUrl from "./assets/svg/Services.svg";

export const { ThemeProvider } = createThemeProvider({
    "isReactStrictModeEnabled": false,
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": '"Work Sans", sans-serif',
        //"fontFamily": "Marianne, sans-serif",
    }),
    "publicUrl": process.env.NODE_ENV === "development" ? "" : "/onyxia-ui",
});

export const customIcons = {
    tourSvgUrl,
    servicesSvgUrl,
};
