import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import { memo } from "react";
import MuiCircularProgress from "@material-ui/core/CircularProgress";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";

export type CircularProgressProps = {
    className?: string | null;
    size?: number;
    color?: "primary" | "textPrimary";
};

export const circularProgressDefaultProps: PickOptionals<CircularProgressProps> = {
    "className": null,
    "size": 40,
    "color": "primary",
};

const { useClassNames } = createUseClassNames<Required<CircularProgressProps>>()((theme, { color }) => ({
    "root": {
        "color": color !== "textPrimary" ? undefined : theme.colors.useCases.typography.textPrimary,
    },
}));

export const CircularProgress = memo((props: CircularProgressProps) => {
    const completedProps = { ...circularProgressDefaultProps, ...noUndefined(props) };

    const { color, size, className } = completedProps;

    const { classNames } = useClassNames(completedProps);

    return (
        <MuiCircularProgress
            color={color === "textPrimary" ? undefined : color}
            className={cx(classNames.root, className)}
            size={size}
        />
    );
});
