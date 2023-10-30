import { memo, forwardRef, type ElementType } from "react";
import type { MouseEventHandler } from "react";
import { tss } from "./lib/tss";
import SvgIcon from "@mui/material/SvgIcon";
import type { Equals } from "tsafe";
import { type IconSizeName, muiComponentNameToFileName } from "./lib/icon";
import { createDynamicSvg } from "./tools/LazySvg";
import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { assert } from "tsafe/assert";

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
 * import type { MuiIconComponentName } from "onyxia-ui/MuiIconComponentName"
 * import { id } from "tsafe/id"
 * icon={id<MuiIconComponentName>("AddHomeWork")}
 * You can also pass the mui component directly:
 * import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
 * icon={AddHomeWorkIcon}
 *
 * SVG url:
 * Example: icon="https://example.com/myCustomIcon.svg"
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
    icon: IconProps.Icon;
    className?: string;
    /** default default */
    size?: IconSizeName;
    onClick?: MouseEventHandler<SVGSVGElement>;
};

export namespace IconProps {
    type MuiComponentType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    type SvgUrl = `${"http" | "/" | ""}${string}.svg`;
    /**
     * Eg: "AddHomeWork"
     * All the MUI icons are listed here: https://mui.com/material-ui/material-icons/
     * The type is too big to be used here but can be imported from "onyxia-ui/MuiIconComponentName"
     */
    type MuiComponentName = string;

    export type Icon = MuiComponentName | SvgUrl | MuiComponentType;
}

export const Icon = memo(
    forwardRef<SVGSVGElement, IconProps>((props, ref) => {
        const { icon, className, size = "default", onClick, ...rest } = props;

        //For the forwarding, rest should be empty (typewise),
        assert<Equals<typeof rest, {}>>();

        const {
            classes,
            cx,
            theme: { publicUrl },
        } = useStyles({ size });

        if (typeof icon !== "string") {
            const MuiIconComponent = icon;

            return (
                <MuiIconComponent
                    ref={ref}
                    className={cx(classes.root, className)}
                    onClick={onClick}
                    {...rest}
                />
            );
        }

        const SvgComponent: ElementType = (() => {
            if (
                icon.startsWith("http") ||
                icon.startsWith("/") ||
                icon.endsWith(".svg")
            ) {
                return createDynamicSvg(icon);
            }

            assert(
                publicUrl !== undefined,
                "If you are using material icons you must provide a publicUrl to create theme",
            );

            return createDynamicSvg(
                `${publicUrl}/material-icons/${muiComponentNameToFileName(
                    icon,
                )}`,
            );
        })();

        return (
            <SvgIcon
                ref={ref}
                onClick={onClick}
                className={cx(classes.root, className)}
                component={SvgComponent}
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

export const createSpecificIcon = memoize((icon: IconProps.Icon) => {
    const SpecificIcon = forwardRef<
        SVGSVGElement,
        Omit<IconProps, "icon" | "ref">
    >((props, ref) => <Icon icon={icon} ref={ref} {...props} />);

    SpecificIcon.displayName = Icon.displayName;

    return SpecificIcon;
});

/*
NOTES:
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTypography.js#L45
https://github.com/mui-org/material-ui/blob/53a1655143aa4ec36c29a6063ccdf89c48a74bfd/packages/material-ui/src/Icon/Icon.js#L12
*/
