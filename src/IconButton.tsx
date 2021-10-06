/* eslint-disable @typescript-eslint/ban-types */
import type { FC } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { forwardRef, memo } from "react";
import MuiIconButton from "@material-ui/core/IconButton";
import type { IconProps } from "./Icon";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

export type IconButtonProps<IconId extends string = never> =
    | IconButtonProps.Clickable<IconId>
    | IconButtonProps.Link<IconId>
    | IconButtonProps.Submit<IconId>;

export namespace IconButtonProps {
    type Common<IconId extends string> = {
        className?: string;
        iconClassName?: string;
        iconId: IconId;
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

export function createIconButton<IconId extends string = never>(params?: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => <></>),
    };

    const useStyles = makeStyles<{ disabled: boolean }>()(
        (theme, { disabled }) => ({
            "root": {
                "padding": theme.spacing(2),
                "&:hover": {
                    "backgroundColor": "unset",
                    "& svg": {
                        "color":
                            theme.colors.useCases.buttons.actionHoverPrimary,
                    },
                },
            },
            "icon": {
                "color":
                    theme.colors.useCases.typography[
                        disabled ? "textDisabled" : "textPrimary"
                    ],
            },
        }),
    );

    const IconButton = memo(
        forwardRef<HTMLButtonElement, IconButtonProps<IconId>>((props, ref) => {
            const {
                className,
                iconClassName,
                iconId,
                size,
                disabled = false,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children,
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
                                "target": doOpenNewTabIfHref
                                    ? "_blank"
                                    : undefined,
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

    return { IconButton };
}
