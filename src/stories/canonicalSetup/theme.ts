import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultTypography,
} from "../../lib";
import { createIcon } from "../../Icon";
import { createIconButton } from "../../IconButton";
import { createButton } from "../../Button";
import "onyxia-design-lab/assets/fonts/work-sans.css";
import { createUseClassNamesFactory } from "tss-react";

//Import icons from https://material-ui.com/components/material-icons/ that you plan to use
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EditIcon from "@material-ui/icons/Edit";

//Import your custom icons
import { ReactComponent as FooSvg } from "./assets/svg/foo.svg";
import { ReactComponent as BarSvg } from "./assets/svg/bar.svg";

export const { ThemeProvider, useTheme } = createThemeProvider({
    //We keep the default color palette but we add a custom color: a shiny pink.
    "typography": {
        ...defaultTypography,
        "fontFamily": '"Work Sans", sans-serif',
    },
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
