import { memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useIsDarkModeEnabled } from "./lib/index";
import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/Brightness7";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import type { IconProps } from "./Icon";
import { makeStyles } from "./lib/ThemeProvider";

const useStyles = makeStyles()(theme => ({
    "root": {
        "transition": "transform 500ms",
        "transform": `rotate(${theme.isDarkModeEnabled ? 180 : 0}deg)`,
        "transitionTimingFunction": "cubic-bezier(.34,1.27,1,1)",
    },
}));

const { Icon } = createIcon({
    "darkModeIcon": DarkModeIcon,
    "lightModeIcon": LightModeIcon,
});

const { IconButton } = createIconButton({ Icon });

export type DarkModeSwitchProps = {
    className?: string;
    /** Default: default */
    size?: IconProps["size"];
};

export const DarkModeSwitch = memo((props: DarkModeSwitchProps) => {
    const { className, size } = props;
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const onClick = useConstCallback(() => {
        setIsDarkModeEnabled(!isDarkModeEnabled);
    });

    const { classes, cx } = useStyles();

    return (
        <IconButton
            className={cx(classes.root, className)}
            onClick={onClick}
            size={size}
            iconId={isDarkModeEnabled ? "lightModeIcon" : "darkModeIcon"}
        />
    );
});
