import { memo, forwardRef } from "react";
import type { MouseEventHandler } from "react";
import { tss } from "./lib/tss";
import type { Equals } from "tsafe";
import type { IconSizeName } from "./lib/icon";
import { LazySvg } from "./tools/LazySvg";
import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { assert } from "tsafe/assert";
import CropSquareIcon from "@mui/icons-material/CropSquare";

/**
 *
 * ======== icon:
 *
 * This can be either a MUI Icon Component or an url pointing to an SVG file.
 *
 * MUI Icons Component:
 * Find the icon you want to use here: https://mui.com/material-ui/material-icons/
 * If, for example you'd like to use this one: https://mui.com/material-ui/material-icons/?selected=AddHomeWork
 * ```ts
 * import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
 * <Icon icon={AddHomeWorkIcon} />
 * ```
 *
 * SVG url:
 * Example: icon="https://example.com/myCustomIcon.svg"
 * It's important that the string ends with ".svg".
 * It can also be a data url like: "data:image/svg+xml..." in this case it doesn't need to end with ".svg".
 * Important: The SVG must have a viewBox and the default width and height are going to be ignored.
 * If you have an svg like:
 * <svg width="127" height="127">
 * You must add a viewBox like so:
 * <svg width="127" height="127" viewBox="0 0 127 127">
 *
 * ======== Colors:
 *
 * All fill colors are ignored and overwrite by the current color.
 * This is so that the icon can be use as special font character of sort.
 * The icon do not support different colors. It's bichrome.
 * If you want to change the whole color you can so so simply by setting the color
 * CSS property on the parent.
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

        const { classes, cx } = useStyles({
            size,
            isMuiComponent: typeof icon !== "string",
        });

        if (typeof icon !== "string") {
            const MuiIconComponent = icon;

            return (
                <MuiIconComponent
                    {...rest}
                    ref={ref}
                    className={cx(classes.root, className)}
                    onClick={onClick}
                />
            );
        }

        if (
            !icon.startsWith("http") &&
            !icon.startsWith("/") &&
            !icon.endsWith(".svg") &&
            !icon.startsWith("data:image/svg")
        ) {
            console.warn(`'${icon}' is not an url`);
            return <Icon {...props} icon={CropSquareIcon} />;
        }

        return (
            <LazySvg
                {...rest}
                ref={ref}
                className={cx(classes.root, className)}
                onClick={onClick}
                svgUrl={icon}
            />
        );
    }),
);

Icon.displayName = symToStr({ Icon });

const useStyles = tss
    .withName({ Icon })
    .withParams<{
        size: IconSizeName;
        isMuiComponent: boolean;
    }>()
    .create(({ theme, size, isMuiComponent }) => ({
        root: {
            color: "inherit",
            // https://stackoverflow.com/a/24626986/3731798
            //"verticalAlign": "top",
            //"display": "inline-block"
            verticalAlign: "top",
            fontSize: theme.iconSizesInPxByName[size],
            width: "1em",
            height: "1em",
            ...(isMuiComponent
                ? undefined
                : {
                      fill: "currentcolor",
                      "& > path": {
                          fill: "currentcolor",
                      },
                  }),
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
