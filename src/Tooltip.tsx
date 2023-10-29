import { memo } from "react";
import type { ReactNode, ReactElement } from "react";
import MuiTooltip from "@mui/material/Tooltip";
import { tss } from "./lib/tss";
import { Text } from "./Text";

export type TooltipProps = {
    title: NonNullable<ReactNode> | undefined;
    children: ReactElement;
    enterDelay?: number;
};

export const Tooltip = memo((props: TooltipProps) => {
    const { title, children, enterDelay } = props;

    const { classes } = useStyles();

    if (title === undefined) {
        return children;
    }

    return (
        <MuiTooltip
            title={
                <Text className={classes.root} typo="caption">
                    {title}
                </Text>
            }
            enterDelay={enterDelay}
        >
            {children}
        </MuiTooltip>
    );
});

const useStyles = tss.withName({ Tooltip }).create(({ theme }) => ({
    "root": {
        "color": theme.colors.palette.light.light,
    },
}));
