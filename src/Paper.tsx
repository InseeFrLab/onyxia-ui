import { memo, forwardRef } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import MuiPaper from "@material-ui/core/Paper";

export type PaperProps = {
    children: NonNullable<React.ReactNode>;
    elevation?: number;
    className?: string;
};

const { useStyles } = makeStyles<Pick<Required<PaperProps>, "elevation">>()(
    (theme, { elevation }) => ({
        "root": {
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "boxShadow": theme.shadows[elevation],
        },
    }),
);

export const Paper = memo(
    forwardRef<HTMLButtonElement, PaperProps>((props, ref) => {
        const {
            children,
            className,
            //For the forwarding, rest should be empty (typewise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            elevation = 1,
            ...rest
        } = props;

        const { classes, cx } = useStyles({ elevation });

        return (
            <MuiPaper
                ref={ref}
                className={cx(classes.root, className)}
                {...rest}
            >
                {children}
            </MuiPaper>
        );
    }),
);
