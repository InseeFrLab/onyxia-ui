import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultGetTypographyDesc,
} from "onyxia-ui/lib";
import { createIcon } from "onyxia-ui/Icon";
import { createIconButton } from "onyxia-ui/IconButton";
import { createButton } from "onyxia-ui/Button";
import { createText } from "onyxia-ui/Text";
import type { Param0 } from "tsafe";
import { createTss } from "tss-react";
import { createOnyxiaSplashScreenLogo } from "onyxia-ui/lib/SplashScreen";
import type { ThemeProviderProps } from "onyxia-ui";
import "onyxia-ui/assets/fonts/WorkSans/font.css";
import "onyxia-ui/assets/fonts/Marianne/font.css";

//Import icons from https://material-ui.com/components/material-icons/ that you plan to use
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import EditIcon from "@mui/icons-material/Edit";

//Import your custom icons
import { ReactComponent as FooSvg } from "./assets/foo.svg";
import { ReactComponent as BarSvg } from "./assets/bar.svg";

export const { ThemeProvider, useTheme } = createThemeProvider({
    "getTypographyDesc": ({ windowInnerWidth, rootFontSizePx }) => {
        const typographyDesc = defaultGetTypographyDesc({
            windowInnerWidth,
            rootFontSizePx,
        });

        return {
            "fontFamily": '"Work Sans", sans-serif',
            "rootFontSizePx": typographyDesc.rootFontSizePx,
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
});

export const { Icon } = createIcon({
    "hello": EmojiPeopleIcon,
    "edit": EditIcon,
    "foo": FooSvg,
    "bar": BarSvg,
});

export type IconId = Param0<typeof Icon>["iconId"];

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
export const { Text } = createText({ useTheme });

export const { tss } = createTss({
    "useContext": function useContext() {
        const theme = useTheme();
        return { theme };
    },
});

export const useStyles = tss.create({});

const { OnyxiaSplashScreenLogo } = createOnyxiaSplashScreenLogo({ useTheme });

export const splashScreen: ThemeProviderProps["splashScreen"] = {
    "Logo": OnyxiaSplashScreenLogo,
    "fadeOutDuration": 500,
};
