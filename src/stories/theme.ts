import { createIcon } from "../Icon";
import { createIconButton } from "../IconButton";
import { createButton } from "../Button";

import { ReactComponent as TourSvg } from "./assets/svg/Tour.svg";
import { ReactComponent as ServicesSvg } from "./assets/svg/Services.svg";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";

console.log({ TourSvg, HelpIcon });

export const { Icon } = createIcon({
    "tour": TourSvg,
    "services": ServicesSvg,
    "help": HelpIcon,
    "home": HomeIcon,
});

export const { IconButton } = createIconButton({ Icon });

export const { Button } = createButton({ Icon });
