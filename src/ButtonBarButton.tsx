import type { ReactNode } from "react";
import { memo } from "react";
import { tss } from "./lib/tss";
import { Button } from "./Button";
import { symToStr } from "tsafe/symToStr";

export type ButtonBarButtonProps =
    | ButtonBarButtonProps.Regular
    | ButtonBarButtonProps.Submit;

export namespace ButtonBarButtonProps {
    type Common = {
        className?: string;
        startIcon?: string;
        disabled?: boolean;
        children: ReactNode;
    };

    export type Regular = Common & {
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
        href?: string;
        /** Defaults to true if href is defined */
        doOpenNewTabIfHref?: boolean;
    };

    export type Submit = Common & {
        type: "submit";
    };
}

export const ButtonBarButton = memo((props: ButtonBarButtonProps) => {
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

ButtonBarButton.displayName = symToStr({ ButtonBarButton });

const useStyles = tss.withName({ ButtonBarButton }).create(({ theme }) => ({
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
