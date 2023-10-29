import { memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useIsDarkModeEnabled } from "./lib";
import type { IconProps } from "./Icon";
import { tss } from "./lib/tss";
import type { MuiIconsComponentName } from "./MuiIconsComponentName";
import { id } from "tsafe/id";
import { IconButton } from "./IconButton";
import { symToStr } from "tsafe/symToStr";

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
            iconId={
                isDarkModeEnabled
                    ? id<MuiIconsComponentName>("Brightness7")
                    : id<MuiIconsComponentName>("Brightness4")
            }
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
