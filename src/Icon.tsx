/* eslint-disable @typescript-eslint/ban-types */

import { memo, forwardRef, ElementType } from "react";
import type { ForwardedRef, MouseEventHandler } from "react";
import { createUseClassNames } from "./lib/ThemeProvider";
import { cx } from "tss-react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";

/**
 * Size:
 *
 * By default icons inherit the font size,
 * it's useful if it's contained inside a <Text />.
 *
 * If you want to change the size you can set the font
 * size manually with css using one of the typography
 * font size. e.g:
 * "fontSize": theme.typography.variant.["body 1"].style.fontSize
 * It works because we set "height": "1em", "width": "1em".
 *
 * Color:
 *
 * By default icons inherit the color.
 * If you want to change the color you can
 * simply set the style "color".
 *
 */
export type IconProps<IconId extends string = string> = {
    iconId: IconId;
    className?: string;
    onClick?: MouseEventHandler<SVGSVGElement>;
};

type MuiIconLike = (props: {
    ref: ForwardedRef<SVGSVGElement>;
    className: string;
    onClick?: MouseEventHandler<SVGSVGElement>;
}) => JSX.Element;

type SvgComponentLike = ElementType;

function isMuiIcon(Component: MuiIconLike | SvgComponentLike): Component is MuiIconLike {
    return "type" in (Component as any);
}

export function createIcon<IconId extends string>(
    params: { readonly [iconId in IconId]: MuiIconLike | SvgComponentLike },
) {
    const { useClassNames } = createUseClassNames()(() => ({
        "root": {
            "color": "inherit",
            // https://stackoverflow.com/a/24626986/3731798
            //"verticalAlign": "top",
            //"display": "inline-block"
            "verticalAlign": "top",
            "fontSize": "inherit",
            "width": "1em",
            "height": "1em",
        },
    }));

    const Icon = memo(
        forwardRef<SVGSVGElement, IconProps<IconId>>((props, ref) => {
            const {
                iconId,
                className,
                onClick,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children,
                ...rest
            } = props;

            //For the forwarding, rest should be empty (typewise),
            doExtends<Any.Equals<typeof rest, {}>, 1>();

            const { classNames } = useClassNames({});

            const Component: MuiIconLike | SvgComponentLike = params[iconId];

            return isMuiIcon(Component) ? (
                <Component
                    ref={ref}
                    className={cx(classNames.root, className)}
                    onClick={onClick}
                    {...rest}
                />
            ) : (
                <SvgIcon
                    ref={ref}
                    onClick={onClick}
                    className={cx(classNames.root, className)}
                    component={Component}
                    {...rest}
                />
            );
        }),
    );

    return { Icon };
}

/*
NOTES: 
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTypography.js#L45
https://github.com/mui-org/material-ui/blob/53a1655143aa4ec36c29a6063ccdf89c48a74bfd/packages/material-ui/src/Icon/Icon.js#L12
*/
