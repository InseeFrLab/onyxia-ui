/* eslint-disable @typescript-eslint/ban-types */

import { memo, forwardRef, ElementType } from "react";
import type { ForwardedRef, MouseEventHandler } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import SvgIcon from "@material-ui/core/SvgIcon";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import type { IconSizeName } from "./lib/icon";

/**
 * Size:
 *
 * If you want to change the size of the icon you can set the font
 * size manually with css using one of the typography
 * fontSize of the root in px.
 *
 * If you place it inside a <Text> element you can define it's size proportional
 * to the font-height:
 * {
 *     "fontHeight": "inherit",
 *     ...(()=>{
 *         const factor = 1.3;
 *         return { "width": `${factor}em`, "height": `${factor}em` }
 *     })()
 * }
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
    /** default default */
    size?: IconSizeName;
    onClick?: MouseEventHandler<SVGSVGElement>;
};

type MuiIconLike = (props: {
    ref: ForwardedRef<SVGSVGElement>;
    className: string;
    onClick?: MouseEventHandler<SVGSVGElement>;
}) => JSX.Element;

type SvgComponentLike = ElementType;

function isMuiIcon(
    Component: MuiIconLike | SvgComponentLike,
): Component is MuiIconLike {
    return "type" in (Component as any);
}

export function createIcon<IconId extends string>(componentByIconId: {
    readonly [iconId in IconId]: MuiIconLike | SvgComponentLike;
}) {
    const useStyles = makeStyles<{ size: IconSizeName }>()(
        (theme, { size }) => ({
            "root": {
                "color": "inherit",
                // https://stackoverflow.com/a/24626986/3731798
                //"verticalAlign": "top",
                //"display": "inline-block"
                "verticalAlign": "top",
                "fontSize": theme.iconSizesInPxByName[size],
                "width": "1em",
                "height": "1em",
            },
        }),
    );

    const Icon = memo(
        forwardRef<SVGSVGElement, IconProps<IconId>>((props, ref) => {
            const {
                iconId,
                className,
                size = "default",
                onClick,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children,
                ...rest
            } = props;

            //For the forwarding, rest should be empty (typewise),
            doExtends<Any.Equals<typeof rest, {}>, 1>();

            const { classes, cx } = useStyles({ size });

            const Component: MuiIconLike | SvgComponentLike =
                componentByIconId[iconId];

            return isMuiIcon(Component) ? (
                <Component
                    ref={ref}
                    className={cx(classes.root, className)}
                    onClick={onClick}
                    {...rest}
                />
            ) : (
                <SvgIcon
                    ref={ref}
                    onClick={onClick}
                    className={cx(classes.root, className)}
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
