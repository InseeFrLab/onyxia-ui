/* eslint-disable @typescript-eslint/ban-types */

import { memo, forwardRef, ElementType } from "react";
import type { ForwardedRef, MouseEventHandler } from "react";
import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";

export type IconProps<IconId = string> = {
    id: IconId;

    className?: string;

    /** Defaults to "textPrimary" */
    color?: "textPrimary" | "textSecondary" | "textDisabled" | "textFocus";
    //TODO: Test if actually works
    /** Defaults to "default" */
    fontSize?: "default" | "inherit" | "small" | "large";

    onClick?: MouseEventHandler<SVGSVGElement>;
};

type MuiIconLike = (props: {
    ref: ForwardedRef<SVGSVGElement>;
    className: string;
    fontSize: "default" | "inherit" | "small" | "large";
    onClick?: MouseEventHandler<SVGSVGElement>;
}) => JSX.Element;

type SvgComponentLike = ElementType;

function isMuiIcon(Component: MuiIconLike | SvgComponentLike): Component is MuiIconLike {
    return "type" in (Component as any);
}

export function createIcon<IconId extends string>(
    params: { readonly [iconId in IconId]: MuiIconLike | SvgComponentLike },
) {
    const { useClassNames } = createUseClassNames<{ color: NonNullable<IconProps["color"]> }>()(
        (theme, { color }) => ({
            "root": {
                "color": theme.colors.useCases.typography[color],
                // https://stackoverflow.com/a/24626986/3731798
                //"verticalAlign": "top",
                //"display": "inline-block"
                "verticalAlign": "top",
            },
        }),
    );

    const Icon = memo(
        forwardRef<SVGSVGElement, IconProps<IconId>>((props, ref) => {
            const {
                id,
                className,
                color = "textPrimary",
                fontSize = "default",
                onClick,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children,
                ...rest
            } = props;

            //For the forwarding, rest should be empty (typewise),
            doExtends<Any.Equals<typeof rest, {}>, 1>();

            const { classNames } = useClassNames({ color });

            const Component: MuiIconLike | SvgComponentLike = params[id];

            return isMuiIcon(Component) ? (
                <Component
                    ref={ref}
                    className={cx(classNames.root, className)}
                    fontSize={fontSize}
                    onClick={onClick}
                    {...rest}
                />
            ) : (
                <SvgIcon
                    ref={ref}
                    onClick={onClick}
                    className={cx(classNames.root, className)}
                    component={Component}
                    fontSize={fontSize}
                    {...rest}
                />
            );
        }),
    );

    return { Icon };
}
