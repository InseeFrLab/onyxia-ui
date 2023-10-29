/* eslint-disable @typescript-eslint/ban-types */
import { tss } from "./lib/tss";
import { forwardRef, memo } from "react";
import MuiIconButton from "@mui/material/IconButton";
import type { IconProps } from "./Icon";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Icon } from "./Icon";
import { symToStr } from "tsafe/symToStr";

export type IconButtonProps =
    | IconButtonProps.Clickable
    | IconButtonProps.Link
    | IconButtonProps.Submit;

export namespace IconButtonProps {
    type Common = {
        className?: string;
        iconClassName?: string;
        iconId: string;
        size?: IconProps["size"];
        /** Defaults to false */
        disabled?: boolean;

        /** Defaults to false */
        autoFocus?: boolean;

        tabIndex?: number;

        name?: string;
        id?: string;
        "aria-label"?: string;
    };

    export type Clickable = Common & {
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
        href?: string;
    };

    export type Link = Common & {
        href: string;
        /** Defaults to true */
        doOpenNewTabIfHref?: boolean;
    };

    export type Submit = Common & {
        type: "submit";
    };
}

export const IconButton = memo(
    forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
        const {
            className,
            iconClassName,
            iconId,
            size,
            disabled = false,
            autoFocus = false,
            tabIndex,
            name,
            id,
            "aria-label": ariaLabel,
            //For the forwarding, rest should be empty (typewise)
            ...rest
        } = props;

        const { classes, cx } = useStyles({ disabled });

        return (
            <MuiIconButton
                ref={ref}
                className={cx(classes.root, className)}
                disabled={disabled}
                aria-label={ariaLabel ?? undefined}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                name={name}
                id={id}
                {...(() => {
                    if ("onClick" in rest) {
                        const { onClick, href, ...restRest } = rest;

                        //For the forwarding, rest should be empty (typewise),
                        assert<Equals<typeof restRest, {}>>();

                        return { onClick, href, ...restRest };
                    }

                    if ("href" in rest) {
                        const {
                            href,
                            doOpenNewTabIfHref = true,
                            ...restRest
                        } = rest;

                        //For the forwarding, rest should be empty (typewise),
                        assert<Equals<typeof restRest, {}>>();

                        return {
                            href,
                            "target": doOpenNewTabIfHref ? "_blank" : undefined,
                            ...restRest,
                        };
                    }

                    if ("type" in rest) {
                        const { type, ...restRest } = rest;

                        //For the forwarding, rest should be empty (typewise),
                        assert<Equals<typeof restRest, {}>>();

                        return {
                            type,
                            ...restRest,
                        };
                    }
                })()}
            >
                <Icon
                    iconId={iconId}
                    className={cx(classes.icon, iconClassName)}
                    size={size}
                />
            </MuiIconButton>
        );
    }),
);

IconButton.displayName = symToStr({ IconButton });

const useStyles = tss
    .withName({ IconButton })
    .withParams<{ disabled: boolean }>()
    .create(({ theme, disabled }) => ({
        "root": {
            "padding": theme.spacing(2),
            "&:hover": {
                "backgroundColor": "unset",
                "& svg": {
                    "color": theme.colors.useCases.buttons.actionHoverPrimary,
                },
            },
        },
        "icon": {
            "color":
                theme.colors.useCases.typography[
                    disabled ? "textDisabled" : "textPrimary"
                ],
        },
    }));
