import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import { forwardRef, memo } from "react";
import MuiTypography from "@material-ui/core/Typography";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";

export type Props = {
    className?: string | null;
    id?: string | null;
    variant?:
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "subtitle1"
        | "subtitle2"
        | "body1"
        | "body2"
        | "caption";
    color?: "primary" | "secondary" | "disabled" | "focus";
    children: NonNullable<React.ReactNode>;
    onClick?: (() => void) | null;
};

export const defaultProps: PickOptionals<Props> = {
    "className": null,
    "id": null,
    "variant": "body1",
    "color": "primary",
    "onClick": null,
};

const { useClassNames } = createUseClassNames<Required<Props>>()((theme, { color, onClick }) => ({
    "root": {
        "color":
            theme.colors.useCases.typography[
                (() => {
                    switch (color) {
                        case "primary":
                            return "textPrimary";
                        case "secondary":
                            return "textSecondary";
                        case "disabled":
                            return "textDisabled";
                        case "focus":
                            return "textFocus";
                    }
                })()
            ],
        "cursor": onClick !== null ? "pointer" : undefined,
    },
}));

export const Typography = memo(
    forwardRef<any, Props>((props, ref) => {
        const completedProps = { ...defaultProps, ...noUndefined(props) };

        const {
            children,
            variant,
            className,
            id,
            //For the forwarding, rest should be empty (typewise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            color,
            onClick,
            ...rest
        } = completedProps;

        const { classNames } = useClassNames(completedProps);

        return (
            <MuiTypography
                id={id ?? undefined}
                className={cx(classNames.root, className)}
                ref={ref}
                variant={variant}
                onClick={onClick ?? undefined}
                {...rest}
            >
                {children}
            </MuiTypography>
        );
    }),
);
