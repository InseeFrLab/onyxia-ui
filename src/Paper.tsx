import { memo, forwardRef } from "react";
import { createUseClassNames } from "./lib/ThemeProvider";
import MuiPaper from "@material-ui/core/Paper";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import { cx } from "tss-react";

export type Props = {
    children: NonNullable<React.ReactNode>;
    elevation?: number;
    className?: string | null;
};

export const defaultProps: PickOptionals<Props> = {
    "className": null,
    "elevation": 1,
};

const { useClassNames } = createUseClassNames<Required<Props>>()((theme, { elevation }) => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "boxShadow": theme.shadows[elevation],
    },
}));
export const Paper = memo(
    forwardRef<HTMLButtonElement, Props>((props, ref) => {
        const completedProps = { ...defaultProps, ...noUndefined(props) };

        const {
            children,
            className,
            //For the forwarding, rest should be empty (typewise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            elevation,
            ...rest
        } = completedProps;

        const { classNames } = useClassNames(completedProps);

        return (
            <MuiPaper ref={ref} className={cx(classNames.root, className)} {...rest}>
                {children}
            </MuiPaper>
        );
    }),
);
