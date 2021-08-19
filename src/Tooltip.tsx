import { memo } from "react";
import type { ReactNode, ReactElement } from "react";
import MuiTooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";

export type TooltipProps = {
    title: NonNullable<ReactNode>;
    children: ReactElement;
    enterDelay?: number;
};

const useStyles = makeStyles()(theme => ({
    "root": {
        "color": theme.colors.palette.light.light,
    },
}));

export const Tooltip = memo((props: TooltipProps) => {
    const { title, children, enterDelay } = props;

    const { classes } = useStyles();

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
