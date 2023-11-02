import "minimal-polyfills/Object.fromEntries";
import { forwardRef, memo } from "react";
import memoize from "memoizee";
import { symToStr } from "tsafe/symToStr";
import { LazySvg, type LazySvgProps } from "./tools/LazySvg";
import { tss } from "./lib/tss";
import { assert, type Equals } from "tsafe/assert";

export type ThemedSvgProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    svgUrl: string;
};

assert<Equals<ThemedSvgProps, LazySvgProps>>();

export const ThemedSvg = memo(
    forwardRef<SVGSVGElement, ThemedSvgProps>((props, ref) => {
        const { className, ...rest } = props;

        const { classes, cx } = useStyles();

        return (
            <LazySvg
                {...rest}
                ref={ref}
                className={cx(classes.root, className)}
            />
        );
    }),
);

ThemedSvg.displayName = symToStr({ ThemedSvg });

const useStyles = tss.withName({ ThemedSvg }).create(({ theme }) => ({
    "root": {
        ...Object.fromEntries(
            [
                [
                    "focus-color-fill",
                    theme.colors.useCases.typography.textFocus,
                ],
                [
                    "text-color-fill",
                    theme.colors.useCases.typography.textPrimary,
                ],
                ["surface-color-fill", theme.colors.useCases.surfaces.surface1],
                [
                    "background-color-fill",
                    theme.colors.useCases.surfaces.background,
                ],
            ].map(([className, color]) => [
                ["&.", "& ."].map(prefix => `${prefix}${className}`).join(", "),
                { "fill": color },
            ]),
        ),
    },
}));

export const createThemedSvg = memoize((svgUrl: string) => {
    const ThemedSvgWithUrl = forwardRef<
        SVGSVGElement,
        Omit<ThemedSvgProps, "svgUrl" | "ref">
    >((props, ref) => <LazySvg svgUrl={svgUrl} ref={ref} {...props} />);

    ThemedSvgWithUrl.displayName = ThemedSvg.displayName;

    return ThemedSvgWithUrl;
});
