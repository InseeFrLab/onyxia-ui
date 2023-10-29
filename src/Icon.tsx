import { memo, forwardRef } from "react";
import type { MouseEventHandler } from "react";
import { tss } from "./lib/tss";
import SvgIcon from "@mui/material/SvgIcon";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { type IconSizeName, muiComponentNameToFileName } from "./lib/icon";
import { createDynamicSvg } from "./tools/LazySvg";
import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";

/**
 *
 * ======== iconId:
 *
 * This can be either a MUI Icon component name, a custom icon id or an url pointing to an SVG file.
 *
 * MUI Icons:
 * Find the icon you want to use here: https://mui.com/material-ui/material-icons/
 * If, for example you'd like to use this one: https://mui.com/material-ui/material-icons/?selected=AddHomeWork
 * use: iconId: "AddHomeWork"
 * This parameter is not typed because there's too much many MUI icons, it would slow down the ide too much.
 * import type { MuiIconsComponentName } from "onyxia-ui/MuiIconsComponentName"
 * import { id } from "tsafe/id"
 * iconId: id<MuiIconsComponentName>("AddHomeWork")
 *
 * Custom Icons:
 * The custom icons are defined using the customIcons params createThemeProvider() function.
 * If you have done:
 * createThemeProvider({ customIcons: { myCustomIcon: "https://example.com/myCustomIcon.svg" } })
 * you can use: iconId: "myCustomIcon"
 * You can also import SVG as components and use them as custom icons:
 * import { ReactComponent as MyCustomIcon } from "./myCustomIcon.svg"
 * createThemeProvider({ customIcons: { myCustomIcon: MyCustomIcon } })
 *
 * I encourage you to enforce the type safety on your side.
 *
 * SVG url:
 * Example: iconId: "https://example.com/myCustomIcon.svg"
 * It's important that the string ends with ".svg".
 *
 * ======== Size:
 *
 * If you want to change the size of the icon you can set the font
 * size manually with css using one of the typography
 * fontSize of the root in px.
 *
 * If you place it inside a <Text> element you can define it's size proportional
 * to the font-height:
 * {
 *     "fontSize": "inherit",
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
export type IconProps = {
    iconId: string;
    className?: string;
    /** default default */
    size?: IconSizeName;
    onClick?: MouseEventHandler<SVGSVGElement>;
};

export const Icon = memo(
    forwardRef<SVGSVGElement, IconProps>((props, ref) => {
        const { iconId, className, size = "default", onClick, ...rest } = props;

        //For the forwarding, rest should be empty (typewise),
        assert<Equals<typeof rest, {}>>();

        const {
            classes,
            cx,
            theme: { customIcons, publicUrl },
        } = useStyles({ size });

        const Component = (() => {
            const customIcon =
                iconId in customIcons ? customIcons[iconId] : undefined;

            if (customIcon !== undefined) {
                return typeof customIcon === "string"
                    ? createDynamicSvg(customIcon)
                    : customIcon;
            }

            if (
                iconId.startsWith("http") ||
                iconId.startsWith("/") ||
                iconId.endsWith(".svg")
            ) {
                return createDynamicSvg(iconId);
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

Icon.displayName = symToStr({ Icon });

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

export const createSpecificIcon = memoize(
    (
        iconId: string,
    ): ((props: Omit<IconProps, "iconId">) => ReturnType<React.FC>) => {
        //svgUrlToSvgComponent(svgUrl);

        const SpecificIcon = forwardRef<
            SVGSVGElement,
            Omit<IconProps, "iconId" | "ref">
        >((props, ref) => <Icon iconId={iconId} ref={ref} {...props} />);

        SpecificIcon.displayName = Icon.displayName;

        return SpecificIcon;
    },
);

/*
NOTES:
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTypography.js#L45
https://github.com/mui-org/material-ui/blob/53a1655143aa4ec36c29a6063ccdf89c48a74bfd/packages/material-ui/src/Icon/Icon.js#L12
*/
