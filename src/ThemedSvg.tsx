import "minimal-polyfills/Object.fromEntries";
import { forwardRef, memo } from "react";
import memoize from "memoizee";
import { symToStr } from "tsafe/symToStr";
import { LazySvg, type LazySvgProps } from "./tools/LazySvg";
import { tss } from "./lib/tss";
import { assert, type Equals } from "tsafe/assert";
import {
    type ThemedAssetUrl,
    useResolveThemedAssetUrl,
} from "./lib/ThemedAssetUrl";
import type { Theme } from "./lib/ThemeProvider";

export type ThemedSvgProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    svgUrl: ThemedAssetUrl;
};

assert<Equals<Omit<ThemedSvgProps, "svgUrl">, Omit<LazySvgProps, "svgUrl">>>();

export const ThemedSvg = memo(
    forwardRef<SVGSVGElement, ThemedSvgProps>((props, ref) => {
        const { className, svgUrl, ...rest } = props;

        const { classes, cx } = useStyles();

        const { resolveThemedAssetUrl } = useResolveThemedAssetUrl();

        return (
            <LazySvg
                {...rest}
                ref={ref}
                svgUrl={resolveThemedAssetUrl(svgUrl)}
                className={cx(classes.root, className)}
            />
        );
    }),
);

ThemedSvg.displayName = symToStr({ ThemedSvg });

const useStyles = tss.withName({ ThemedSvg }).create(({ theme }) => ({
    "root": {
        ...Object.fromEntries(
            getClassesAndColors({ "colorUseCases": theme.colors.useCases }).map(
                ({ className, color }) => [
                    ["&.", "& ."]
                        .map(prefix => `${prefix}${className}`)
                        .join(", "),
                    { "fill": color },
                ],
            ),
        ),
    },
}));

export function getClassesAndColors(params: {
    colorUseCases: Theme["colors"]["useCases"];
}): { className: string; color: string }[] {
    const { colorUseCases } = params;

    return [
        ["focus-color-fill", colorUseCases.typography.textFocus],
        ["text-color-fill", colorUseCases.typography.textPrimary],
        ["surface-color-fill", colorUseCases.surfaces.surface1],
        ["background-color-fill", colorUseCases.surfaces.background],
    ].map(([className, color]) => ({
        className,
        color,
    }));
}

export const createThemedSvg = memoize((svgUrl: string) => {
    const ThemedSvgWithUrl = forwardRef<
        SVGSVGElement,
        Omit<ThemedSvgProps, "svgUrl" | "ref">
    >((props, ref) => <LazySvg svgUrl={svgUrl} ref={ref} {...props} />);

    ThemedSvgWithUrl.displayName = ThemedSvg.displayName;

    return ThemedSvgWithUrl;
});
