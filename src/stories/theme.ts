import { createThemeProvider, defaultGetTypographyDesc } from "../lib";
import { createIcon } from "../Icon";
import { createIconButton } from "../IconButton";
import { createButton } from "../Button";
import { createText } from "../Text";

import { ReactComponent as TourSvg } from "./assets/svg/Tour.svg";
import { ReactComponent as ServicesSvg } from "./assets/svg/Services.svg";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import { Param0 } from "tsafe";

export const { ThemeProvider, useTheme } = createThemeProvider({
    "isReactStrictModeEnabled": false,
    "getTypographyDesc": ({ windowInnerWidth, browserFontSizeFactor }) => ({
        ...defaultGetTypographyDesc({ windowInnerWidth, browserFontSizeFactor }),
        "fontFamily": '"Work Sans", sans-serif',
    }),
});

export const { Icon } = createIcon({
    "tour": TourSvg,
    "services": ServicesSvg,
    "help": HelpIcon,
    "home": HomeIcon,
});

export type IconId = Param0<typeof Icon>["iconId"];

export const { IconButton } = createIconButton({ Icon });

export const { Button } = createButton({ Icon });

export const { Text } = createText({ useTheme });
