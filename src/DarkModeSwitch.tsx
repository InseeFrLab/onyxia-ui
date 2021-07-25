import { memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useNamedState } from "powerhooks";
import { useIsDarkModeEnabled } from "./lib/index";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import LightModeIcon from "@material-ui/icons/Brightness7";
import { motion } from "framer-motion";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import { makeStyles } from "./lib/ThemeProvider";

const useStyles = makeStyles()({
    "root": {
        "display": "flex",
        "width": 50,
        "height": 50,
        "alignItems": "center",
        "justifyContent": "center",
        "padding": 0,
    },
});

const { Icon } = createIcon({
    "darkModeIcon": DarkModeIcon,
    "lightModeIcon": LightModeIcon,
});

const { IconButton } = createIconButton({ Icon });

export type DarkModeSwitchProps = {
    className?: string;
};

export const DarkModeSwitch = memo((props: DarkModeSwitchProps) => {
    const { className } = props;
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();
    const { motionProps, setMotionProps } = useNamedState("motionProps", {
        "rotate": 0,
    });

    const onClick = useConstCallback(() => {
        setIsDarkModeEnabled(!isDarkModeEnabled);
        setMotionProps({
            "rotate": motionProps.rotate === 0 ? 360 : 0,
        });
    });

    const { classes, cx } = useStyles();

    return (
        <motion.div
            className={cx(classes.root, className)}
            animate={motionProps}
        >
            <IconButton
                onClick={onClick}
                iconId={isDarkModeEnabled ? "lightModeIcon" : "darkModeIcon"}
            />
        </motion.div>
    );
});
