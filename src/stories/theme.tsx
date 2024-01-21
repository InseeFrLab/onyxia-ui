import * as React from "react";
import "../assets/fonts/WorkSans/font.css";
import "../assets/fonts/Marianne/font.css";
import { createOnyxiaUi, defaultGetTypographyDesc } from "../lib";
import { emotionCache } from "./emotionCache";
import { CacheProvider } from "@emotion/react";
import tourSvgUrl from "./assets/svg/Tour.svg";
import servicesSvgUrl from "./assets/svg/Services.svg";

const { OnyxiaUi: OnyxiaUiWithoutEmotionCache } = createOnyxiaUi({
    "isScoped": true,
    "isReactStrictModeEnabled": false,
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": '"Work Sans", sans-serif',
        //"fontFamily": "Marianne, sans-serif",
    }),
    "BASE_URL": process.env.NODE_ENV === "development" ? "" : "/onyxia-ui",
});

export function OnyxiaUi(props: {
    darkMode?: boolean;
    children: React.ReactNode;
}) {
    const { darkMode, children } = props;
    return (
        <CacheProvider value={emotionCache}>
            <OnyxiaUiWithoutEmotionCache darkMode={darkMode}>
                {children}
            </OnyxiaUiWithoutEmotionCache>
        </CacheProvider>
    );
}

export const customIcons = {
    tourSvgUrl,
    servicesSvgUrl,
};
