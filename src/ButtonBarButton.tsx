import type { ReactNode, FC } from "react";
import { memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import type { IconProps } from "./Icon";
import { createButton } from "./Button";

export type ButtonBarButtonProps<IconId extends string = never> =
    | ButtonBarButtonProps.Regular<IconId>
    | ButtonBarButtonProps.Submit<IconId>;

export namespace ButtonBarButtonProps {
    type Common<IconId> = {
        className?: string;

        startIcon?: IconId;
        disabled?: boolean;
        children: NonNullable<ReactNode>;
    };

    export type Regular<IconId extends string = never> = Common<IconId> & {
        onClick?: () => void;
        href?: string;
        /** Defaults to true if href is defined */
        doOpenNewTabIfHref?: boolean;
    };

    export type Submit<IconId extends string = never> = Common<IconId> & {
        type: "submit";
    };
}

export function createButtonBarButton<IconId extends string = never>(params: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params;

    const { Button } = createButton({ Icon });

    const ButtonBarButton = memo((props: ButtonBarButtonProps<IconId>) => {
        const { className, startIcon, disabled, children, ...rest } = props;

        const { classes, cx } = useStyles();

        return (
            <Button
                className={cx(classes.root, className)}
                variant="secondary"
                startIcon={startIcon}
                disabled={disabled}
                {...rest}
            >
                {children}
            </Button>
        );
    });

    const useStyles = makeStyles({ "name": { ButtonBarButton } })(theme => ({
        "root": {
            "backgroundColor": "transparent",
            "borderRadius": "unset",
            "borderColor": "transparent",
            "transition": "none",
            "& > *": {
                "transition": "none",
            },
            "&:hover.MuiButton-text": {
                "color": theme.colors.useCases.typography.textPrimary,
                "borderBottomColor": theme.colors.useCases.buttons.actionActive,
                "boxSizing": "border-box",
                "backgroundColor": "unset",
                "& .MuiSvgIcon-root": {
                    "color": theme.colors.useCases.typography.textPrimary,
                },
            },
            "&:active.MuiButton-text": {
                "color": theme.colors.useCases.typography.textFocus,
                "& .MuiSvgIcon-root": {
                    "color": theme.colors.useCases.typography.textFocus,
                },
            },
        },
    }));

    return { ButtonBarButton };
}
