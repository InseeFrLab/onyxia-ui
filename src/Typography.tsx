import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import { forwardRef, memo } from "react";
import MuiTypography from "@material-ui/core/Typography";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";

export type TypographyProps = {
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
    doUseDivAsRootComponent?: boolean;
    onClick?: (() => void) | null;
};

export const typographyDefaultProps: PickOptionals<TypographyProps> = {
    "className": null,
    "id": null,
    "variant": "body1",
    "color": "primary",
    "doUseDivAsRootComponent": false,
    "onClick": null,
};

const { useClassNames } = createUseClassNames<Required<TypographyProps>>()(
    (theme, { color, onClick }) => ({
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
    }),
);

export const Typography = memo(
    forwardRef<any, TypographyProps>((props, ref) => {
        const completedProps = { ...typographyDefaultProps, ...noUndefined(props) };

        const {
            children,
            variant,
            className,
            id,
            //For the forwarding, rest should be empty (typewise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            color,
            onClick,
            doUseDivAsRootComponent,
            ...rest
        } = completedProps;

        const { classNames } = useClassNames(completedProps);

        return (
            <MuiTypography
                {...(doUseDivAsRootComponent ? { "component": "div" } : {})}
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