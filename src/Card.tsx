import type { ReactNode } from "react";
import { forwardRef, memo } from "react";
import { tss } from "./lib/tss";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

export type CardProps = {
    className?: string;
    aboveDivider?: ReactNode;
    children: ReactNode;
};

export const Card = memo(
    forwardRef<any, CardProps>((props, ref) => {
        const {
            className,
            aboveDivider,
            children,
            //For the forwarding, rest should be empty (typewise)
            ...rest
        } = props;

        //For the forwarding, rest should be empty (typewise),
        assert<Equals<typeof rest, {}>>();

        const { classes, cx } = useStyles();

        return (
            <div ref={ref} className={cx(classes.root, className)} {...rest}>
                {aboveDivider !== undefined && (
                    <div className={classes.aboveDivider}>{aboveDivider}</div>
                )}
                <div className={classes.belowDivider}>{children}</div>
            </div>
        );
    }),
);

const useStyles = tss.withName({ Card }).create(({ theme }) => ({
    root: {
        borderRadius: 8,
        boxShadow: theme.shadows[1],
        backgroundColor: theme.colors.useCases.surfaces.surface1,
        "&:hover": {
            boxShadow: theme.shadows[6],
        },
        display: "flex",
        flexDirection: "column",
    },
    aboveDivider: {
        padding: theme.spacing({ topBottom: 3, rightLeft: 4 }),
        borderBottom: `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        boxSizing: "border-box",
    },
    belowDivider: {
        padding: theme.spacing(4),
        paddingTop: theme.spacing(3),
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
}));
