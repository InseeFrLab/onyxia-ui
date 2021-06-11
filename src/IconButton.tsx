/* eslint-disable @typescript-eslint/ban-types */
import type { FC } from "react";
import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import { forwardRef, memo } from "react";
import MuiIconButton from "@material-ui/core/IconButton";
import type { IconProps } from "./Icon";
import { id } from "tsafe/id";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";

export type IconButtonProps<IconId extends string = never> =
    | IconButtonProps.Clickable<IconId>
    | IconButtonProps.Link<IconId>
    | IconButtonProps.Submit<IconId>;

export namespace IconButtonProps {
    type Common<IconId extends string> = {
        className?: string;
        id: IconId;
        /** Defaults to false */
        disabled?: boolean;

        /** Defaults to "default" */
        fontSize?: IconProps["fontSize"];

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

export function createIconButton<IconId extends string = never>(params?: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params ?? { "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => <></>) };

    const { useClassNames } = createUseClassNames()(theme => ({
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

    const IconButton = memo(
        forwardRef<HTMLButtonElement, IconButtonProps<IconId>>((props, ref) => {
            const {
                className,
                id,
                disabled = false,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children,
                autoFocus = false,
                tabIndex,
                name,
                htmlId,
                fontSize = "default",
                "aria-label": ariaLabel,
                //For the forwarding, rest should be empty (typewise)
                ...rest
            } = props;

            const { classNames } = useClassNames({});

            return (
                <MuiIconButton
                    ref={ref}
                    className={cx(classNames.root, className)}
                    disabled={disabled}
                    aria-label={ariaLabel ?? undefined}
                    autoFocus={autoFocus}
                    tabIndex={tabIndex}
                    name={name}
                    id={htmlId}
                    {...(() => {
                        if ("onClick" in rest) {
                            const { onClick, href, ...restRest } = rest;

                            //For the forwarding, rest should be empty (typewise),
                            doExtends<Any.Equals<typeof restRest, {}>, 1>();

                            return { onClick, href, ...restRest };
                        }

                        if ("href" in rest) {
                            const { href, doOpenNewTabIfHref = true, ...restRest } = rest;

                            //For the forwarding, rest should be empty (typewise),
                            doExtends<Any.Equals<typeof restRest, {}>, 1>();

                            return {
                                href,
                                "target": doOpenNewTabIfHref ? "_blank" : undefined,
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
                    <Icon
                        color={disabled ? "textDisabled" : "textPrimary"}
                        id={id}
                        fontSize={fontSize}
                    />
                </MuiIconButton>
            );
        }),
    );

    return { IconButton };
}
