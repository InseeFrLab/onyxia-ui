/* eslint-disable @typescript-eslint/ban-types */
import type { TypographyOptions as MuiTypographyOptions } from "@mui/material/styles/createTypography";
import { id } from "tsafe/id";
import { breakpointsValues } from "./breakpoints";
import { objectKeys } from "tsafe/objectKeys";
export type { ChromeFontSize } from "powerhooks/ViewPortAdapter";
export { chromeFontSizesFactors } from "powerhooks/ViewPortAdapter";

export type TypographyDesc<CustomVariantName extends string> = {
    fontFamily: string;
    rootFontSizePx: number;
    variants: {
        [VariantName in
            | CustomVariantName
            | TypographyDesc.VariantNameBase]: TypographyDesc.Variant;
    };
};
export declare namespace TypographyDesc {
    export type Variant = {
        htmlComponent: HtmlComponent;
        fontWeight: FontWeightProperty;
        fontSizeRem: number;
        lineHeightRem: number;
        fontFamily?: string;
    };

    export namespace Variant {
        export type Style = {
            fontFamily: string;
            fontWeight: FontWeightProperty;
            fontSize: `${number}px`;
            lineHeight: `${number}px`;
        };
    }

    export type VariantNameBase =
        | "display heading"
        | "page heading"
        | "subtitle"
        | "section heading"
        | "object heading"
        | "label 1"
        | "label 2"
        | "navigation label"
        | "body 1"
        | "body 2"
        | "body 3"
        | "caption";

    export type FontWeightProperty =
        | FontWeightProperty.Globals
        | FontWeightProperty.FontWeightAbsolute
        | "bolder"
        | "lighter";
    export namespace FontWeightProperty {
        export type FontWeightAbsolute = number | "bold" | "normal";
        export type Globals =
            | "-moz-initial"
            | "inherit"
            | "initial"
            | "revert"
            | "unset";
    }

    export type HtmlComponent =
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "p"
        | "span"
        | "div"
        | "a";
}

export type ComputedTypography<CustomVariantName extends string> = {
    rootFontSizePx: number;
    fontFamily: string;
    variants: {
        [VariantName in CustomVariantName | TypographyDesc.VariantNameBase]: {
            htmlComponent: TypographyDesc.HtmlComponent;
            style: TypographyDesc.Variant.Style;
        };
    };
};

export type GetTypographyDesc<CustomVariantName extends string> = (params: {
    windowInnerWidth: number;
    windowInnerHeight: number;
    browserFontSizeFactor: number;
}) => TypographyDesc<CustomVariantName>;

export const defaultGetTypographyDesc: GetTypographyDesc<never> = ({
    windowInnerWidth,
    browserFontSizeFactor,
}) => ({
    "fontFamily": "sans-serif",
    "rootFontSizePx": 16 * browserFontSizeFactor,
    "variants": {
        "display heading": {
            "htmlComponent": "h1",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("bold"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 2.8,
                        "lineHeightRem": 3.25,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 2.25,
                        "lineHeightRem": 2.5,
                    };
                }

                return {
                    "fontSizeRem": 1.75,
                    "lineHeightRem": 2.5,
                };
            })(),
        },
        "page heading": {
            "htmlComponent": "h2",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("bold"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 2.25,
                        "lineHeightRem": 2.5,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 1.75,
                        "lineHeightRem": 2.25,
                    };
                }

                return {
                    "fontSizeRem": 1.125,
                    "lineHeightRem": 1.25,
                };
            })(),
        },
        "subtitle": {
            "htmlComponent": "h3",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("normal"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1.75,
                        "lineHeightRem": 2.25,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 1.5,
                        "lineHeightRem": 2,
                    };
                }

                return {
                    "fontSizeRem": 1,
                    "lineHeightRem": 1.475,
                };
            })(),
        },
        "section heading": {
            "htmlComponent": "h4",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("bold"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1.5,
                        "lineHeightRem": 2,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 1.25,
                        "lineHeightRem": 1.7,
                    };
                }

                return {
                    "fontSizeRem": 0.875,
                    "lineHeightRem": 1.28,
                };
            })(),
        },
        "object heading": {
            "htmlComponent": "h5",
            "fontWeight": id<TypographyDesc.FontWeightProperty>(600),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1.25,
                        "lineHeightRem": 1.7,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 1.125,
                        "lineHeightRem": 1.25,
                    };
                }

                return {
                    "fontSizeRem": 0.875,
                    "lineHeightRem": 1.28,
                };
            })(),
        },
        "navigation label": {
            "htmlComponent": "h5",
            "fontWeight": id<TypographyDesc.FontWeightProperty>(500),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1.25,
                        "lineHeightRem": 1.7,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 1.125,
                        "lineHeightRem": 1.25,
                    };
                }

                return {
                    "fontSizeRem": 0.875,
                    "lineHeightRem": 1.28,
                };
            })(),
        },
        "label 1": {
            "htmlComponent": "h6",
            "fontWeight": id<TypographyDesc.FontWeightProperty>(500),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1,
                        "lineHeightRem": 1.475,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.875,
                        "lineHeightRem": 1.28,
                    };
                }

                return {
                    "fontSizeRem": 0.75,
                    "lineHeightRem": 1,
                };
            })(),
        },
        "label 2": {
            "htmlComponent": "h6",
            "fontWeight": id<TypographyDesc.FontWeightProperty>(500),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 0.875,
                        "lineHeightRem": 1.28,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.75,
                        "lineHeightRem": 1,
                    };
                }

                return {
                    "fontSizeRem": 0.625,
                    "lineHeightRem": 0.69,
                };
            })(),
        },
        "body 1": {
            "htmlComponent": "p",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("normal"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 1,
                        "lineHeightRem": 1.475,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.875,
                        "lineHeightRem": 1.28,
                    };
                }

                return {
                    "fontSizeRem": 0.75,
                    "lineHeightRem": 1,
                };
            })(),
        },
        "body 2": {
            "htmlComponent": "p",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("normal"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 0.875,
                        "lineHeightRem": 1.28,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.75,
                        "lineHeightRem": 1,
                    };
                }

                return {
                    "fontSizeRem": 0.625,
                    "lineHeightRem": 0.69,
                };
            })(),
        },
        "body 3": {
            "htmlComponent": "p",
            "fontWeight": "normal",
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 0.875,
                        "lineHeightRem": 1.28,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.75,
                        "lineHeightRem": 1,
                    };
                }

                return {
                    "fontSizeRem": 0.625,
                    "lineHeightRem": 0.69,
                };
            })(),
        },
        "caption": {
            "htmlComponent": "p",
            "fontWeight": id<TypographyDesc.FontWeightProperty>("normal"),
            ...(() => {
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return {
                        "fontSizeRem": 0.75,
                        "lineHeightRem": 1,
                    };
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "fontSizeRem": 0.625,
                        "lineHeightRem": 0.69,
                    };
                }

                return {
                    "fontSizeRem": 0.45,
                    "lineHeightRem": 0.75,
                };
            })(),
        },
    },
});

export const variantNameUsedForMuiButton = "label 1";

export const { createMuiTypographyOptions, getComputedTypography } = (() => {
    type TypographyDescLike<CustomVariantName extends string> = {
        fontFamily: string;
        rootFontSizePx: number;
        variants: {
            [Name in TypographyDesc.VariantNameBase | CustomVariantName]: {
                fontWeight: TypographyDesc.FontWeightProperty;
                fontSizeRem: number;
                lineHeightRem: number;
                fontFamily?: string;
            };
        };
    };

    function getTypographyVariantStyleFactory<
        CustomVariantName extends string,
    >(params: { typographyDesc: TypographyDescLike<CustomVariantName> }) {
        const {
            typographyDesc: { fontFamily, rootFontSizePx, variants },
        } = params;

        function getTypographyVariantStyle(params: {
            variantName: TypographyDesc.VariantNameBase | CustomVariantName;
        }): TypographyDesc.Variant.Style {
            const { variantName } = params;

            const {
                fontSizeRem,
                lineHeightRem,
                fontWeight,
                fontFamily: variantFontFamily,
            } = variants[variantName];

            return {
                "fontFamily": variantFontFamily ?? fontFamily,
                fontWeight,
                //NOTE: We put as any because we use TS 4.2.2 for Storybook but with newer version is not necessary.
                "fontSize": `${fontSizeRem * rootFontSizePx}px` as any,
                "lineHeight": `${lineHeightRem * rootFontSizePx}px` as any,
            };
        }

        return { getTypographyVariantStyle };
    }

    function getComputedTypography<CustomVariantName extends string>(params: {
        typographyDesc: TypographyDesc<CustomVariantName>;
    }): ComputedTypography<CustomVariantName> {
        const { typographyDesc } = params;

        const { getTypographyVariantStyle } = getTypographyVariantStyleFactory({
            typographyDesc,
        });

        const computedTypography: ComputedTypography<CustomVariantName> = {
            "rootFontSizePx": typographyDesc.rootFontSizePx,
            "fontFamily": typographyDesc.fontFamily,
            "variants": {} as any,
        };

        objectKeys(typographyDesc.variants).forEach(
            variantName =>
                (computedTypography.variants[variantName] = {
                    "style": getTypographyVariantStyle({ variantName }),
                    "htmlComponent":
                        typographyDesc.variants[variantName].htmlComponent,
                }),
        );

        return computedTypography;
    }

    function createMuiTypographyOptions(params: {
        typographyDesc: TypographyDescLike<never>;
    }): MuiTypographyOptions {
        const { typographyDesc } = params;

        const { getTypographyVariantStyle } = getTypographyVariantStyleFactory({
            typographyDesc,
        });

        return {
            "fontFamily": typographyDesc.fontFamily,
            "fontWeightRegular": "normal",
            "fontWeightMedium": 500,
            "h1": getTypographyVariantStyle({
                "variantName": "display heading",
            }),
            "h2": getTypographyVariantStyle({ "variantName": "page heading" }),
            "h3": getTypographyVariantStyle({ "variantName": "subtitle" }),
            "h4": getTypographyVariantStyle({
                "variantName": "section heading",
            }),
            "h5": getTypographyVariantStyle({
                "variantName": "object heading",
            }),
            "h6": getTypographyVariantStyle({
                "variantName": "navigation label",
            }),
            "subtitle1": getTypographyVariantStyle({
                "variantName": "label 1",
            }),
            "subtitle2": getTypographyVariantStyle({ "variantName": "body 2" }),
            "body1": getTypographyVariantStyle({ "variantName": "body 1" }),
            "body2": getTypographyVariantStyle({ "variantName": "body 2" }),
            "caption": getTypographyVariantStyle({ "variantName": "caption" }),
            "button": getTypographyVariantStyle({
                "variantName": variantNameUsedForMuiButton,
            }),
        };
    }

    return { createMuiTypographyOptions, getComputedTypography };
})();
