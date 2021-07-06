import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultGetTypographyDesc,
} from "../../lib";
import { createIcon } from "../../Icon";
import { createIconButton } from "../../IconButton";
import { createButton } from "../../Button";
import { createText } from "../../Text";
import "onyxia-design-lab/assets/fonts/work-sans.css";
import { createUseClassNamesFactory } from "tss-react";

//Import icons from https://material-ui.com/components/material-icons/ that you plan to use
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EditIcon from "@material-ui/icons/Edit";

//Import your custom icons
import { ReactComponent as FooSvg } from "./assets/svg/foo.svg";
import { ReactComponent as BarSvg } from "./assets/svg/bar.svg";

export const { ThemeProvider, useTheme } = createThemeProvider({
    "getTypographyDesc": ({
        windowInnerWidth,
        //When users go to it's browser setting he can select the font size "small", "medium", "default"
        //You can choose to take that into account for example by doing "rootFontSizePx": 10 * browserFontSizeFactor (default)
        browserFontSizeFactor,
    }) => {
        const typographyDesc = defaultGetTypographyDesc({
            windowInnerWidth,
            browserFontSizeFactor,
        });

        return {
            "fontFamily": '"Work Sans", sans-serif',
            "rootFontSizePx": typographyDesc.rootFontSizePx,
            "variants": {
                ...typographyDesc.variants,
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

export const { createUseClassNames } = createUseClassNamesFactory({ useTheme });

export const { Icon } = createIcon({
    "hello": EmojiPeopleIcon,
    "edit": EditIcon,
    "foo": FooSvg,
    "bar": BarSvg,
});

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
export const { Text } = createText({ useTheme });
