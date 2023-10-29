/* eslint-disable @typescript-eslint/ban-types */

import { memo, forwardRef, ElementType } from "react";
import type { MouseEventHandler } from "react";
import { tss } from "./lib/ThemeProvider";
import SvgIcon from "@mui/material/SvgIcon";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { type IconSizeName, muiComponentNameToFileName } from "./lib/icon";
import { createDynamicSvg } from "./tools/LazySvg";
import { id } from "tsafe/id";
import { MuiIconId } from "./assets/material-icons/type";
import { typeGuard } from "tsafe/typeGuard";

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
export type IconProps<CustomIconId extends string = string> = {
    iconId: CustomIconId | MuiIconId;
    className?: string;
    /** default default */
    size?: IconSizeName;
    onClick?: MouseEventHandler<SVGSVGElement>;
};

export function createIcon<CustomIconId extends string>(params: {
    /**
     * If your app is hosted at the origin (e.g. https://example.com/), set publicUrl to ''.
     * If your app is hosted at a sub-path (e.g. https://example.com/sub-path/), set publicUrl to '/sub-path'.
     *
     * If you are using create-react-app you can set:
     * "publicUrl": process.env["PUBLIC_URL"]
     * (It is constrained by what's in the "homepage" filed of package.json)
     **/
    publicUrl: string;
    customIcons?: Record<CustomIconId, ElementType | string>;
}) {
    const { publicUrl, customIcons } = params;

    const Icon = memo(
        forwardRef<SVGSVGElement, IconProps<CustomIconId>>((props, ref) => {
            const {
                iconId,
                className,
                size = "default",
                onClick,
                ...rest
            } = props;

            //For the forwarding, rest should be empty (typewise),
            assert<Equals<typeof rest, {}>>();

            const { classes, cx } = useStyles({ size });

            const Component = (() => {
                const customIcon =
                    customIcons !== undefined &&
                    typeGuard<CustomIconId>(iconId, iconId in customIcons)
                        ? customIcons[iconId]
                        : undefined;

                if (customIcon !== undefined) {
                    return typeof customIcon === "string"
                        ? createDynamicSvg(customIcon)
                        : id<ElementType>(customIcon);
                }

                return createDynamicSvg(
                    `${publicUrl}/material-icons/${muiComponentNameToFileName(
                        iconId,
                    )}`,
                );
            })();

            return (
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

    const useStyles = tss
        .withName({ Icon })
        .withParams<{
            size: IconSizeName;
        }>()
        .create(({ theme, size }) => ({
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
        }));

    return { Icon };
}

/*
NOTES:
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTypography.js#L45
https://github.com/mui-org/material-ui/blob/53a1655143aa4ec36c29a6063ccdf89c48a74bfd/packages/material-ui/src/Icon/Icon.js#L12
*/
