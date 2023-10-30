import { memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useIsDarkModeEnabled } from "./lib";
import type { IconProps } from "./Icon";
import { tss } from "./lib/tss";
import { IconButton } from "./IconButton";
import { symToStr } from "tsafe/symToStr";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";

export type DarkModeSwitchProps = {
    className?: string;
    /** Default: default */
    size?: IconProps["size"];
    ariaLabel?: string;
};

export const DarkModeSwitch = memo((props: DarkModeSwitchProps) => {
    const { className, size, ariaLabel } = props;
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
            icon={isDarkModeEnabled ? Brightness7Icon : Brightness4Icon}
            aria-label={ariaLabel ?? "Dark mode switch"}
        />
    );
});

DarkModeSwitch.displayName = symToStr({ DarkModeSwitch });

const useStyles = tss.withName({ DarkModeSwitch }).create(({ theme }) => ({
    "root": {
        "transition": "transform 500ms",
        "transform": `rotate(${theme.isDarkModeEnabled ? 180 : 0}deg)`,
        "transitionTimingFunction": "cubic-bezier(.34,1.27,1,1)",
    },
}));
