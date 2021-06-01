import { forwardRef, memo } from "react";
import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import MuiButton from "@material-ui/core/Button";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import type { Props as IconProps } from "./Icon";
import { Icon } from "./Icon";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { capitalize } from "tsafe/capitalize";

export type Props = {
    className?: string | null;

    color?: "primary" | "secondary" | "ternary";
    /** can be optional with an icon */
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?(): void;

    startIcon?: IconProps["type"] | null;
    endIcon?: IconProps["type"] | null;

    autoFocus?: boolean;

    type?: "button" | "submit";

    tabIndex?: number | null;

    name?: string | null;
    id?: string | null;

    href?: string | null;
    doOpenNewTabIfHref?: boolean;
};

export const defaultProps: PickOptionals<Props> = {
    "className": null,
    "color": "primary",
    "disabled": false,
    "children": null,
    "startIcon": null,
    "endIcon": null,
    "autoFocus": false,
    "type": "button",
    "onClick": () => {
        /*Do nothing*/
    },
    "tabIndex": null,
    "name": null,
    "id": null,
    "href": null,
    "doOpenNewTabIfHref": true,
};

const { useClassNames } = createUseClassNames<Required<Props>>()((theme, { color, disabled }) => {
    const textColor = ({ color, disabled }: Pick<Required<Props>, "color" | "disabled">) =>
        theme.colors.useCases.typography[
            disabled
                ? "textDisabled"
                : (() => {
                      switch (color) {
                          case "primary":
                              return "textFocus";
                          case "secondary":
                          case "ternary":
                              return "textPrimary";
                      }
                  })()
        ];

    const hoverTextColor = ({ color }: Pick<Required<Props>, "color" | "disabled">) => {
        switch (theme.isDarkModeEnabled) {
            case true:
                return theme.colors.palette[
                    (() => {
                        switch (color) {
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
    };

    return {
        "root": (() => {
            const hoverBackgroundColor =
                theme.colors.useCases.buttons[
                    (() => {
                        switch (color) {
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
                          switch (color) {
                              case "primary":
                              case "secondary":
                                  return "transparent";
                              case "ternary":
                                  return theme.colors.useCases.surfaces.background;
                          }
                      })(),
                "height": 36,
                "borderRadius": 20,
                "borderWidth": (() => {
                    switch (color) {
                        case "primary":
                        case "secondary":
                            return 2;
                        case "ternary":
                            return 0;
                    }
                })(),
                "borderStyle": "solid",
                "borderColor": disabled ? "transparent" : hoverBackgroundColor,
                "padding": theme.spacing(0, 2),
                "&.MuiButton-text": {
                    "color": textColor({ color, disabled }),
                },
                "&:hover": {
                    "backgroundColor": hoverBackgroundColor,
                    "& .MuiSvgIcon-root": {
                        "color": hoverTextColor({ color, disabled }),
                    },
                    "&.MuiButton-text": {
                        "color": hoverTextColor({ color, disabled }),
                    },
                },
            };
        })(),
        "icon": {
            "color": textColor({ color, disabled }),
        },
    };
});

export const Button = memo(
    forwardRef<HTMLButtonElement, Props>((props, ref) => {
        const completedProps = { ...defaultProps, ...noUndefined(props) };

        const {
            className,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            color,
            disabled,
            children,
            onClick,
            startIcon,
            endIcon,
            autoFocus,
            type,
            tabIndex,
            name,
            id,
            href,
            doOpenNewTabIfHref,
            //For the forwarding, rest should be empty (typewise)
            ...rest
        } = completedProps;

        const { classNames } = useClassNames(completedProps);

        const IconWd = useGuaranteedMemo(
            () => (props: { type: IconProps["type"] }) =>
                (
                    <Icon
                        color={disabled ? "textDisabled" : "textPrimary"}
                        fontSize="inherit"
                        className={classNames.icon}
                        type={props.type}
                    />
                ),
            [disabled, classNames.icon],
        );

        return (
            <MuiButton
                ref={ref}
                className={cx(classNames.root, className)}
                //There is an error in @material-ui/core types, this should be correct.
                {...((href === undefined
                    ? {}
                    : { href, "target": doOpenNewTabIfHref ? "_blank" : undefined }) as any)}
                disabled={disabled}
                onClick={onClick}
                startIcon={startIcon === null ? undefined : <IconWd type={startIcon} />}
                endIcon={endIcon === null ? undefined : <IconWd type={endIcon} />}
                autoFocus={autoFocus}
                type={type}
                tabIndex={tabIndex ?? undefined}
                name={name ?? undefined}
                id={id ?? undefined}
                {...rest}
            >
                {typeof children === "string" ? capitalize(children) : children}
            </MuiButton>
        );
    }),
);
