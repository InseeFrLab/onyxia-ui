import type { ReactNode, FC } from "react";
import { memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import type { IconProps } from "./Icon";
import { createButton } from "./Button";

export type ButtonBarButtonProps<IconId extends string = never> =
    | ButtonBarButtonProps.Clickable<IconId>
    | ButtonBarButtonProps.Link<IconId>
    | ButtonBarButtonProps.Submit<IconId>;

export namespace ButtonBarButtonProps {
    type Common<IconId> = {
        className?: string;

        startIcon?: IconId;
        disabled?: boolean;
        children: NonNullable<ReactNode>;
    };

    export type Clickable<IconId extends string = never> = Common<IconId> & {
        onClick(): void;
        href?: string;
    };

    export type Link<IconId extends string = never> = Common<IconId> & {
        href: string;
        /** Defaults to true */
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

    const useStyles = makeStyles()(theme => ({
        "root": {
            "backgroundColor": "transparent",
            "borderRadius": "unset",
            "borderColor": "transparent",
            "& .MuiTouchRipple-root": {
                "display": "none",
            },
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

    return { ButtonBarButton };
}
