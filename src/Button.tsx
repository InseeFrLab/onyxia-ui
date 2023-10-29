import { forwardRef, memo } from "react";
import { tss } from "./lib/tss";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import MuiButton from "@mui/material/Button";
import { capitalize } from "tsafe/capitalize";
import { assert } from "tsafe";
import type { Equals } from "tsafe/Equals";
import { breakpointsValues } from "./lib/breakpoints";
import { variantNameUsedForMuiButton } from "./lib/typography";
import { pxToNumber } from "./tools/pxToNumber";
import { Icon } from "./Icon";
import { symToStr } from "tsafe/symToStr";

export type ButtonProps = ButtonProps.Regular | ButtonProps.Submit;

export namespace ButtonProps {
    type Common = {
        className?: string;

        /** Defaults to "primary" */
        variant?: "primary" | "secondary" | "ternary";

        children: React.ReactNode;

        /** Defaults to false */
        disabled?: boolean;

        startIcon?: string;
        endIcon?: string;

        /** Defaults to false */
        autoFocus?: boolean;

        tabIndex?: number;

        name?: string;
        htmlId?: string;
        "aria-label"?: string;
    };

    export type Regular = Common & {
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
        href?: string;
        /** Default to true if href */
        doOpenNewTabIfHref?: boolean;
    };

    export type Submit = Common & {
        type: "submit";
    };
}

export const Button = memo(
    forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
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

        const { classes, cx } = useStyles({
            variant,
            disabled,
        });

        const IconWd = useGuaranteedMemo(
            () => (props: { iconId: string }) =>
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
                //There is an error in @mui/material types, this should be correct.
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
                    if ("type" in rest) {
                        const { type, ...restRest } = rest;

                        //For the forwarding, rest should be empty (typewise),
                        assert<Equals<typeof restRest, {}>>();

                        return {
                            type,
                            ...restRest,
                        };
                    }

                    const {
                        onClick,
                        href,
                        doOpenNewTabIfHref = href !== undefined,
                        ...restRest
                    } = rest;

                    return {
                        onClick,
                        href,
                        "target": doOpenNewTabIfHref ? "_blank" : undefined,
                        ...restRest,
                    };
                })()}
            >
                {typeof children === "string" ? capitalize(children) : children}
            </MuiButton>
        );
    }),
);

Button.displayName = symToStr({ Button });

const useStyles = tss
    .withName({ Button })
    .withParams<{
        variant: NonNullable<ButtonProps["variant"]>;
        disabled: boolean;
    }>()
    .create(({ theme, variant, disabled }) => {
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

                const paddingSpacingTopBottom = 2;

                const borderWidth = (() => {
                    switch (variant) {
                        case "primary":
                        case "secondary":
                            return 2;
                        case "ternary":
                            return 0;
                    }
                })();

                const approxHeight =
                    2 * theme.spacing(paddingSpacingTopBottom) +
                    2 * borderWidth +
                    pxToNumber(
                        theme.typography.variants[variantNameUsedForMuiButton]
                            .style.lineHeight,
                    );

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
                    "borderRadius": approxHeight / 2,
                    borderWidth,
                    "borderStyle": "solid",
                    "borderColor": disabled
                        ? "transparent"
                        : hoverBackgroundColor,
                    ...theme.spacing.topBottom(
                        "padding",
                        paddingSpacingTopBottom,
                    ),
                    ...theme.spacing.rightLeft(
                        "padding",
                        (() => {
                            if (
                                theme.windowInnerWidth >= breakpointsValues.xl
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
                } as const;
            })(),
            "icon": {
                "color": textColor,
            },
        };
    });
