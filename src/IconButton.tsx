/* eslint-disable @typescript-eslint/ban-types */
import type { FC } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { forwardRef, memo } from "react";
import MuiIconButton from "@mui/material/IconButton";
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

    const useStyles = makeStyles<{ disabled: boolean }>({
        "name": { IconButton },
    })((theme, { disabled }) => ({
        "root": {
            "padding": theme.spacing(2),
            "&:hover": {
                "backgroundColor": "unset",
                "& svg": {
                    "color": theme.colors.useCases.buttons.actionHoverPrimary,
                },
            },

            //NOTE: If the position of the button is relative (the default)
            //it goes hover everything not positioned, we have to mess with z-index and
            //we don't want that.
            //The relative positioning is needed for the touch ripple effect.
            //If we dont have position relative the effect is not restricted to the
            //button: https://user-images.githubusercontent.com/6702424/157982515-c97dfa81-b09a-4323-beb9-d1e92e7ebe4d.mov
            //The solution is set 'position: relative' only when the ripple effect is supposed to be visible.
            //This explain the following awful rules.
            //The expected result is: https://user-images.githubusercontent.com/6702424/157984062-27e544c3-f86f-47b8-b141-c5f61b8a2880.mov
            "position": "unset",
            "& .MuiTouchRipple-root": {
                "display": "none",
            },
            "&:active": {
                "position": "relative",
                "& .MuiTouchRipple-root": {
                    "display": "unset",
                },
            },
            "&:focus": {
                "position": "relative",
                "& .MuiTouchRipple-root": {
                    "display": "unset",
                },
                "&:hover": {
                    "position": "unset",
                    "& .MuiTouchRipple-root": {
                        "display": "none",
                    },
                    "&:active": {
                        "position": "relative",
                        "& .MuiTouchRipple-root": {
                            "display": "unset",
                        },
                    },
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

    return { IconButton };
}
