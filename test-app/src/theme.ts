import {
    createOnyxiaUi,
    defaultPalette,
    createDefaultColorUseCases,
    defaultGetTypographyDesc,
} from "onyxia-ui";
import { createTextWithCustomTypos } from "onyxia-ui/Text";
import "onyxia-ui/assets/fonts/WorkSans/font.css";
import "onyxia-ui/assets/fonts/Marianne/font.css";
import logoSvgUrl from "onyxia-ui/assets/logo.svg";
import { createGetIconUrl } from "mui-icons-material-lazy";

//Import your custom icons
import fooSvgUrl from "./assets/foo.svg";
import barSvgUrl from "./assets/bar.svg";

const { OnyxiaUi, ofTypeTheme } = createOnyxiaUi({
    getTypographyDesc: params => {
        const typographyDesc = defaultGetTypographyDesc(params);

        return {
            ...typographyDesc,
            fontFamily: '"Work Sans", sans-serif',
            variants: {
                ...typographyDesc.variants,
                "display heading": {
                    ...typographyDesc.variants["display heading"],
                    fontFamily: "Marianne, sans-serif",
                },
                //We add a typography variant to the default ones
                "my hero": {
                    htmlComponent: "h1",
                    //Be mindful to pick one of the fontWeight you imported
                    //(in this example onyxia-design-lab/assets/fonts/work-sans.css)
                    fontWeight: "bold",
                    fontSizeRem: 4.5,
                    lineHeightRem: 4,
                },
            },
        };
    },
    //We keep the default color palette but we add a custom color: a shiny pink.
    palette: {
        ...defaultPalette,
        shinyPink: {
            main: "#FF69B4",
        },
    },
    //We keep the default surceases colors except that we add
    //a new usage scenario: "flash" and we use our pink within.
    createColorUseCases: ({ isDarkModeEnabled, palette }) => ({
        ...createDefaultColorUseCases({ isDarkModeEnabled, palette }),
        flashes: {
            cute: palette.shinyPink.main,
            warning: palette.orangeWarning.light,
        },
    }),
    splashScreenParams: {
        assetUrl: logoSvgUrl,
        assetScaleFactor: 1,
    },
});

export { OnyxiaUi };

export type Theme = typeof ofTypeTheme;

export const { Text } = createTextWithCustomTypos<Theme>();

export const customIcons = {
    fooSvgUrl,
    barSvgUrl,
};

export const { getIconUrl, getIconUrlByName } = createGetIconUrl({
    BASE_URL: process.env.PUBLIC_URL,
});
