import { memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useNamedState } from "powerhooks";
import { useIsDarkModeEnabled } from "./lib/index";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import LightModeIcon from "@material-ui/icons/Brightness7";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import type { IconProps } from "./Icon";

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

const transition: Transition = { "duration": 0.5 };

export const DarkModeSwitch = memo((props: DarkModeSwitchProps) => {
    const { className, size } = props;
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();
    const { motionProps, setMotionProps } = useNamedState("motionProps", {
        "rotate": 0,
    });

    const onClick = useConstCallback(() => {
        setIsDarkModeEnabled(!isDarkModeEnabled);
        setMotionProps({
            "rotate": motionProps.rotate === 0 ? 180 : 0,
        });
    });

    return (
        <motion.div
            className={className}
            animate={motionProps}
            transition={transition}
        >
            <IconButton
                onClick={onClick}
                size={size}
                iconId={isDarkModeEnabled ? "lightModeIcon" : "darkModeIcon"}
            />
        </motion.div>
    );
});
