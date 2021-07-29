/* eslint-disable @typescript-eslint/ban-types */
import type { FC } from "react";
import { forwardRef, memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import type { IconProps } from "./Icon";
import { id } from "tsafe/id";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import MuiButton from "@material-ui/core/Button";
import { capitalize } from "tsafe/capitalize";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import { useDomRect } from "powerhooks/useDomRect";
import { breakpointsValues } from "./lib/responsive";
import { useMergeRefs } from "powerhooks/useMergeRef";

export type ButtonProps<IconId extends string = never> =
    | ButtonProps.Clickable<IconId>
    | ButtonProps.Link<IconId>
    | ButtonProps.Submit<IconId>;

export namespace ButtonProps {
    type Common<IconId extends string> = {
        className?: string;

        /** Defaults to "primary" */
        variant?: "primary" | "secondary" | "ternary";

        children: React.ReactNode;

        /** Defaults to false */
        disabled?: boolean;

        startIcon?: IconId;
        endIcon?: IconId;

        /** Defaults to false */
        autoFocus?: boolean;

        tabIndex?: number;

        name?: string;
        htmlId?: string;
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

export function createButton<IconId extends string = never>(params?: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => <></>),
    };

    const useStyles = makeStyles<{
        variant: NonNullable<ButtonProps["variant"]>;
        disabled: boolean;
        height: number;
    }>()((theme, { variant, disabled, height }) => {
        const textColor =
            theme.colors.useCases.typography[
                disabled
                    ? "textDisabled"
                    : (() => {
                          switch (variant) {
                              case "primary":
                                  return "textFocus";
                              case "secondary":
                              case "ternary":
                                  return "textPrimary";
                          }
                      })()
            ];

        const hoverTextColor = (() => {
            switch (theme.isDarkModeEnabled) {
                case true:
                    return theme.colors.palette[
                        (() => {
                            switch (variant) {
                                case "primary":
                                    return "light";
                                case "secondary":
                                case "ternary":
                                    return "dark";
                            }
                        })()
                    ].main;
                case false:
                    return theme.colors.palette.light.main;
            }
        })();

        return {
            "root": (() => {
                const hoverBackgroundColor =
                    theme.colors.useCases.buttons[
                        (() => {
                            switch (variant) {
                                case "primary":
                                    return "actionHoverPrimary";
                                case "secondary":
                                case "ternary":
                                    return "actionHoverSecondary";
                            }
                        })()
                    ];

                return {
                    "textTransform": "unset" as const,
                    "backgroundColor": disabled
                        ? theme.colors.useCases.buttons.actionDisabledBackground
                        : (() => {
                              switch (variant) {
                                  case "primary":
                                  case "secondary":
                                      return "transparent";
                                  case "ternary":
                                      return theme.colors.useCases.surfaces
                                          .background;
                              }
                          })(),
                    "borderRadius":
                        height === 0
                            ? theme.typography.rootFontSizePx
                            : height / 2,
                    "borderWidth": (() => {
                        switch (variant) {
                            case "primary":
                            case "secondary":
                                return 2;
                            case "ternary":
                                return 0;
                        }
                    })(),
                    "borderStyle": "solid",
                    "borderColor": disabled
                        ? "transparent"
                        : hoverBackgroundColor,
                    "padding": theme.spacing(
                        2,
                        (() => {
                            if (
                                theme.responsive.windowInnerWidth >=
                                breakpointsValues.xl
                            ) {
                                return 3;
                            }

                            return 4;
                        })(),
                    ),
                    "&.MuiButton-text": {
                        "color": textColor,
                    },
                    "&:hover": {
                        "backgroundColor": hoverBackgroundColor,
                        "& .MuiSvgIcon-root": {
                            "color": hoverTextColor,
                        },
                        "&.MuiButton-text": {
                            "color": hoverTextColor,
                        },
                    },
                };
            })(),
            "icon": {
                "color": textColor,
            },
        };
    });

    const Button = memo(
        forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps<IconId>>(
            (props, forwardedRef) => {
                const {
                    className,
                    variant = "primary",
                    disabled = false,
                    children,
                    startIcon,
                    endIcon,
                    autoFocus = false,
                    tabIndex,
                    name,
                    htmlId,
                    "aria-label": ariaLabel,
                    //For the forwarding, rest should be empty (typewise)
                    ...rest
                } = props;

                const {
                    ref: internalRef,
                    domRect: { height },
                } = useDomRect();

                const ref = useMergeRefs([internalRef, forwardedRef]);

                const { classes, cx } = useStyles({
                    variant,
                    disabled,
                    height,
                });

                const IconWd = useGuaranteedMemo(
                    () => (props: { iconId: IconId }) =>
                        (
                            <Icon
                                iconId={props.iconId}
                                className={classes.icon}
                                size="default"
                            />
                        ),
                    [disabled, classes.icon],
                );

                return (
                    <MuiButton
                        ref={ref}
                        className={cx(classes.root, className)}
                        //There is an error in @material-ui/core types, this should be correct.
                        disabled={disabled}
                        startIcon={
                            startIcon === undefined ? undefined : (
                                <IconWd iconId={startIcon} />
                            )
                        }
                        endIcon={
                            endIcon === undefined ? undefined : (
                                <IconWd iconId={endIcon} />
                            )
                        }
                        autoFocus={autoFocus}
                        tabIndex={tabIndex}
                        name={name}
                        id={htmlId}
                        aria-label={ariaLabel}
                        {...(() => {
                            if ("onClick" in rest) {
                                const { onClick, href, ...restRest } = rest;

                                //For the forwarding, rest should be empty (typewise),
                                doExtends<Any.Equals<typeof restRest, {}>, 1>();

                                return { onClick, href, ...restRest };
                            }

                            if ("href" in rest) {
                                const {
                                    href,
                                    doOpenNewTabIfHref = true,
                                    ...restRest
                                } = rest;

                                //For the forwarding, rest should be empty (typewise),
                                doExtends<Any.Equals<typeof restRest, {}>, 1>();

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
                                doExtends<Any.Equals<typeof restRest, {}>, 1>();

                                return {
                                    type,
                                    ...restRest,
                                };
                            }
                        })()}
                    >
                        {typeof children === "string"
                            ? capitalize(children)
                            : children}
                    </MuiButton>
                );
            },
        ),
    );

    return { Button };
}
