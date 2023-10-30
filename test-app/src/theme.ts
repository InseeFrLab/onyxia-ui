import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultGetTypographyDesc,
} from "onyxia-ui/lib";
import { createTss } from "tss-react";
import { AnimatedOnyxiaLogo } from "onyxia-ui/AnimatedOnyxiaLogo";
import { createTextWithCustomTypos } from "onyxia-ui/Text";
import "onyxia-ui/assets/fonts/WorkSans/font.css";
import "onyxia-ui/assets/fonts/Marianne/font.css";

//Import your custom icons
import fooSvgUrl from "./assets/foo.svg";
import barSvgUrl from "./assets/bar.svg";

export const { ThemeProvider, useTheme } = createThemeProvider({
    "publicUrl": process.env.PUBLIC_URL,
    "getTypographyDesc": params => {
        const typographyDesc = defaultGetTypographyDesc(params);

        return {
            ...typographyDesc,
            "fontFamily": '"Work Sans", sans-serif',
            "variants": {
                ...typographyDesc.variants,
                "display heading": {
                    ...typographyDesc.variants["display heading"],
                    "fontFamily": "Marianne, sans-serif",
                },
                //We add a typography variant to the default ones
                "my hero": {
                    "htmlComponent": "h1",
                    //Be mindful to pick one of the fontWeight you imported
                    //(in this example onyxia-design-lab/assets/fonts/work-sans.css)
                    "fontWeight": "bold",
                    "fontSizeRem": 4.5,
                    "lineHeightRem": 4,
                },
            },
        };
    },
    //We keep the default color palette but we add a custom color: a shiny pink.
    "palette": {
        ...defaultPalette,
        "shinyPink": {
            "main": "#3333",
        },
    },
    //We keep the default surceases colors except that we add
    //a new usage scenario: "flash" and we use our pink within.
    "createColorUseCases": ({ isDarkModeEnabled, palette }) => ({
        ...createDefaultColorUseCases({ isDarkModeEnabled, palette }),
        "flashes": {
            "cute": palette.shinyPink.main,
            "warning": palette.orangeWarning.light,
        },
    }),
    "splashScreenParams": {
        "Logo": AnimatedOnyxiaLogo,
        "fadeOutDuration": 500,
    },
});

export const { Text } = createTextWithCustomTypos({
    useTheme,
});

export const { tss } = createTss({
    "useContext": function useContext() {
        const theme = useTheme();
        return { theme };
    },
});

export const useStyles = tss.create({});

export const customIcons = {
    fooSvgUrl,
    barSvgUrl,
};
