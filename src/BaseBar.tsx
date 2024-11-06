import { ReactNode } from "react";
import { tss } from "./lib/tss";
import { symToStr } from "tsafe/symToStr";

export type BaseBarProps = {
    className?: string;
    children: ReactNode;
};

export function BaseBar(props: BaseBarProps) {
    const { className, children } = props;

    const { classes, cx } = useStyles();

    return <div className={cx(classes.root, className)}>{children}</div>;
}

BaseBar.displayName = symToStr({ BaseBar });

const useStyles = tss.withName({ BaseBar }).create(({ theme }) => ({
    root: {
        backgroundColor: theme.colors.useCases.surfaces.surface1,
        boxShadow: theme.shadows[1],
        borderRadius: 8,
        overflow: "hidden",
    },
}));
