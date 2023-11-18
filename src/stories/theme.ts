import "../assets/fonts/WorkSans/font.css";
import "../assets/fonts/Marianne/font.css";
import { createOnyxiaUi, defaultGetTypographyDesc } from "../lib";

import tourSvgUrl from "./assets/svg/Tour.svg";
import servicesSvgUrl from "./assets/svg/Services.svg";

export const { OnyxiaUi } = createOnyxiaUi({
    "isScoped": true,
    "isReactStrictModeEnabled": false,
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": '"Work Sans", sans-serif',
        //"fontFamily": "Marianne, sans-serif",
    }),
    "BASE_URL": process.env.NODE_ENV === "development" ? "" : "/onyxia-ui",
});

export const customIcons = {
    tourSvgUrl,
    servicesSvgUrl,
};
