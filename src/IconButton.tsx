import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import { forwardRef, memo } from "react";
import MuiIconButton from "@material-ui/core/IconButton";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import type { Props as IconProps } from "./Icon";
import { Icon } from "./Icon";

export type Props = {
    className?: string | null;

    disabled?: boolean;
    onClick: (() => void) | undefined;

    type: IconProps["type"];
    fontSize?: IconProps["fontSize"];

    "aria-label"?: string | null;
};

export const defaultProps: PickOptionals<Props> = {
    "className": null,
    "disabled": false,
    "fontSize": "default",
    "aria-label": null,
};

const { useClassNames } = createUseClassNames<Required<Props>>()(theme => ({
    "root": {
        "padding": theme.spacing(1),
        "&:hover": {
            "backgroundColor": "unset",
            "& svg": {
                "color": theme.colors.useCases.buttons.actionHoverPrimary,
            },
        },
    },
}));

export const IconButton = memo(
    forwardRef<HTMLButtonElement, Props>((props, ref) => {
        const completedProps = { ...defaultProps, ...noUndefined(props) };

        const {
            disabled,
            onClick,
            type,
            fontSize,
            className,
            "aria-label": ariaLabel,
            //For the forwarding, rest should be empty (typewise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            children,
            ...rest
        } = completedProps;

        const { classNames } = useClassNames(completedProps);

        //const icon =

        return (
            <MuiIconButton
                ref={ref}
                className={cx(classNames.root, className)}
                disabled={disabled}
                onClick={onClick}
                aria-label={ariaLabel ?? undefined}
                {...rest}
            >
                <Icon
                    color={disabled ? "textDisabled" : "textPrimary"}
                    type={type}
                    fontSize={fontSize}
                />
            </MuiIconButton>
        );
    }),
);
