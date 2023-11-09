import "minimal-polyfills/Object.fromEntries";
import { forwardRef, memo } from "react";
import memoize from "memoizee";
import { symToStr } from "tsafe/symToStr";
import { LazySvg, type LazySvgProps } from "./tools/LazySvg";
import { tss } from "./lib/tss";
import { assert, type Equals } from "tsafe/assert";
import {
    type ThemedAssetUrl,
    useResolveAssetVariantUrl,
} from "./lib/ThemedAssetUrl";

export type ThemedSvgProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    svgUrl: ThemedAssetUrl;
};

assert<Equals<Omit<ThemedSvgProps, "svgUrl">, Omit<LazySvgProps, "svgUrl">>>();

export const ThemedSvg = memo(
    forwardRef<SVGSVGElement, ThemedSvgProps>((props, ref) => {
        const { className, svgUrl, ...rest } = props;

        const { classes, cx } = useStyles();

        const resolvedThemedSvgUrl = useResolveAssetVariantUrl(svgUrl);

        return (
            <LazySvg
                {...rest}
                ref={ref}
                svgUrl={resolvedThemedSvgUrl}
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
