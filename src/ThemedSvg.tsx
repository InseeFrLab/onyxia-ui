import "minimal-polyfills/Object.fromEntries";
import { forwardRef, useEffect, useState, memo } from "react";
import memoize from "memoizee";
import { symToStr } from "tsafe/symToStr";
import {
    LazySvg,
    fetchSvgAsHTMLElement,
    type LazySvgProps,
} from "./tools/LazySvg";
import { tss, useStyles as useTheme } from "./lib/tss";
import { assert, type Equals } from "tsafe/assert";
import {
    type ThemedAssetUrl,
    useResolveThemedAssetUrl,
    resolveThemedAssetUrl,
} from "./lib/ThemedAssetUrl";

import { type PaletteBase, type ColorUseCasesBase } from "./lib/color";

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

export const createThemedSvg = memoize((svgUrl: string) => {
    const ThemedSvgWithUrl = forwardRef<
        SVGSVGElement,
        Omit<ThemedSvgProps, "svgUrl" | "ref">
    >((props, ref) => <LazySvg svgUrl={svgUrl} ref={ref} {...props} />);

    ThemedSvgWithUrl.displayName = ThemedSvg.displayName;

    return ThemedSvgWithUrl;
});

const useStyles = tss.withName({ ThemedSvg }).create(({ theme }) => ({
    "root": {
        ...Object.fromEntries(
            getClassesAndColors({
                "palette": theme.colors.palette,
                "useCases": theme.colors.useCases,
            }).map(({ className, color }) => [
                ["&.", "& ."].map(prefix => `${prefix}${className}`).join(", "),
                { "fill": color },
            ]),
        ),
    },
}));

function getClassesAndColors(params: {
    palette: PaletteBase;
    useCases: ColorUseCasesBase;
}): { className: string; color: string }[] {
    const { palette, useCases } = params;

    const generatePaletteObject = (
        colors: any,
        type: "palette" | "useCases",
    ) => {
        const out: {
            className: string;
            color: string;
        }[] = [];

        for (const key in colors) {
            const colorGroup = colors[key];
            for (const colorKey in colorGroup) {
                out.push({
                    "className": `onyxia-fill-${type}-${key}-${colorKey}`,
                    "color": colorGroup[colorKey],
                });
            }
        }

        return out;
    };

    return [
        ...generatePaletteObject(palette, "palette"),
        ...generatePaletteObject(useCases, "useCases"),
    ];
}

export async function getThemedSvgAsDataUrl(params: {
    svgUrl: ThemedAssetUrl;
    isDarkModeEnabled: boolean;
    palette: PaletteBase;
    useCases: ColorUseCasesBase;
}): Promise<`data:image/svg+xml,${string}`> {
    const { svgUrl, isDarkModeEnabled, palette, useCases } = params;

    const resolvedUrl = resolveThemedAssetUrl({
        "themedAssetUrl": svgUrl,
        isDarkModeEnabled,
    });

    const svgElement = await fetchSvgAsHTMLElement(resolvedUrl);

    if (svgElement === undefined) {
        throw new Error(`Failed to fetch svg at url: ${resolvedUrl}`);
    }

    (function updateFillColor(element: Element) {
        getClassesAndColors({
            palette,
            useCases,
        }).forEach(({ className, color }) => {
            if (element.getAttribute("class")?.includes(className)) {
                element.setAttribute("fill", color);
            }
        });

        for (const child of Array.from(element.children)) {
            updateFillColor(child);
        }
    })(svgElement);

    return `data:image/svg+xml,${encodeURIComponent(
        new XMLSerializer().serializeToString(svgElement),
    )}`;
}

export function useThemedSvgAsDataUrl(svgUrl: ThemedAssetUrl) {
    const {
        theme: {
            isDarkModeEnabled,
            colors: { palette, useCases },
        },
    } = useTheme();

    const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        let isActive = true;

        (async () => {
            let dataUrl: string;

            try {
                dataUrl = await getThemedSvgAsDataUrl({
                    svgUrl,
                    isDarkModeEnabled,
                    palette,
                    useCases,
                });
            } catch (error) {
                console.warn(String(error));
                return;
            }

            if (!isActive) {
                return;
            }

            setDataUrl(dataUrl);
        })();

        return () => {
            isActive = false;
        };
    }, [isDarkModeEnabled, palette, useCases]);

    return dataUrl;
}
