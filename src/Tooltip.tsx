import { memo } from "react";
import type { ReactNode, ReactElement } from "react";
import MuiTooltip from "@material-ui/core/Tooltip";
import { createUseClassNames, Text } from "./lib/ThemeProvider";

export type TooltipProps = {
    title: NonNullable<ReactNode>;
    children: ReactElement;
    enterDelay?: number;
};

const { useClassNames } = createUseClassNames()(theme => ({
    "root": {
        "color": theme.colors.palette.light.light,
    },
}));

export const Tooltip = memo((props: TooltipProps) => {
    const { title, children, enterDelay } = props;

    const { classNames } = useClassNames({});

    return (
        <MuiTooltip
            title={
                <Text className={classNames.root} typo="caption">
                    {title}
                </Text>
            }
            enterDelay={enterDelay}
        >
            {children}
        </MuiTooltip>
    );
});
