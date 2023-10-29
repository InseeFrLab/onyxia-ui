import { breakpointsValues } from "./breakpoints";
import { capitalize } from "tsafe/capitalize";
import { uncapitalize } from "tsafe/uncapitalize";

export const iconSizeNames = [
    "extra small",
    "small",
    "default",
    "medium",
    "large",
] as const;

export type IconSizeName = typeof iconSizeNames[number];

export type GetIconSizeInPx = (params: {
    sizeName: IconSizeName;
    windowInnerWidth: number;
    rootFontSizePx: number;
}) => number;

export const defaultGetIconSizeInPx: GetIconSizeInPx = ({
    sizeName,
    windowInnerWidth,
    rootFontSizePx,
}) =>
    rootFontSizePx *
    (() => {
        switch (sizeName) {
            case "extra small":
                return 1;
            case "small":
                if (windowInnerWidth >= breakpointsValues.lg) {
                    return 1.25;
                }

                return 1;

            case "default":
                if (windowInnerWidth >= breakpointsValues.lg) {
                    return 1.5;
                }

                return 1.25;
            case "medium":
                if (windowInnerWidth >= breakpointsValues.lg) {
                    return 2;
                }

                return 1.25;

            case "large":
                if (windowInnerWidth >= breakpointsValues.xl) {
                    return 2.5;
                }

                if (windowInnerWidth >= breakpointsValues.lg) {
                    return 2;
                }

                return 1.5;
        }
    })();

export function getIconSizesInPxByName(params: {
    getIconSizeInPx: GetIconSizeInPx;
    windowInnerWidth: number;
    rootFontSizePx: number;
}): Record<IconSizeName, number> {
    const { getIconSizeInPx, windowInnerWidth, rootFontSizePx } = params;

    const out: ReturnType<typeof getIconSizesInPxByName> = {} as any;

    iconSizeNames.forEach(
        sizeName =>
            (out[sizeName] = getIconSizeInPx({
                windowInnerWidth,
                rootFontSizePx,
                sizeName,
            })),
    );

    return out;
}

export const wordByNumberEntries = [
    ["10", "ten"],
    ["11", "eleven"],
    ["12", "twelve"],
    ["13", "thirteen"],
    ["14", "fourteen"],
    ["15", "fifteen"],
    ["16", "sixteen"],
    ["17", "seventeen"],
    ["18", "eighteen"],
    ["19", "nineteen"],
    ["21", "twentyOne"],
    ["22", "twentyTwo"],
    ["23", "twentyThree"],
    ["24", "twentyFour"],
    ["20", "twenty"],
    ["30", "thirty"],
    ["360", "threeSixty"],
    ["60", "sixty"],
    ["1", "one"],
    ["2", "two"],
    ["3", "three"],
    ["4", "four"],
    ["5", "five"],
    ["6", "six"],
    ["7", "seven"],
    ["8", "eight"],
    ["9", "nine"],
];

export const { muiComponentNameToFileName } = (() => {
    const numberByWord = Object.fromEntries(
        wordByNumberEntries.map(([num, word]) => [word.toLowerCase(), num]),
    );

    function muiComponentNameToFileName(muiComponentName: string) {
        special_cases: {
            let baseMuiComponentName = muiComponentName;
            let variant:
                | "base"
                | "outlined"
                | "rounded"
                | "two_tone"
                | "sharp" = "base";

            if (baseMuiComponentName.endsWith("Outlined")) {
                baseMuiComponentName = baseMuiComponentName.replace(
                    /Outlined$/,
                    "",
                );
                variant = "outlined";
            } else if (baseMuiComponentName.endsWith("Rounded")) {
                baseMuiComponentName = baseMuiComponentName.replace(
                    /Rounded$/,
                    "",
                );
                variant = "rounded";
            } else if (baseMuiComponentName.endsWith("TwoTone")) {
                baseMuiComponentName = baseMuiComponentName.replace(
                    /TwoTone$/,
                    "",
                );
                variant = "two_tone";
            } else if (baseMuiComponentName.endsWith("Sharp")) {
                baseMuiComponentName = baseMuiComponentName.replace(
                    /Sharp$/,
                    "",
                );
                variant = "sharp";
            }

            let baseIconFilename: string;

            if (baseMuiComponentName === "Grid3x3") {
                baseIconFilename = "grid_3x3";
            } else if (baseMuiComponentName === "Grid4x4") {
                baseIconFilename = "grid_4x4";
            } else {
                break special_cases;
            }

            return `${baseIconFilename}${
                variant === "base" ? "" : `_${variant}`
            }_24px.svg`;
        }

        const muiComponentNameWithoutTwoTone = muiComponentName.replace(
            /TwoTone$/,
            "",
        );

        const isTwoTone = muiComponentNameWithoutTwoTone !== muiComponentName;

        const iconFileName = muiComponentNameWithoutTwoTone
            .replace("OneKk", "TenK")
            .replace("TwentyOne", "Twentyone")
            .replace("TwentyTwo", "Twentytwo")
            .replace("TwentyThree", "Twentythree")
            .replace("TwentyFour", "Twentyfour")
            .replace("ThreeSixty", "Threesixty")
            .split(/(?=[A-Z0-9])/)
            .map(word => uncapitalize(word))
            .map((word, i) => {
                console.log("===>", word);

                const num = numberByWord[word];

                if (num === undefined) {
                    return word;
                }

                if (i === 0) {
                    return `${num}!!!`;
                }

                return num;
            })
            .reduce((acc, word) => {
                if (acc === "") {
                    return word;
                }

                if (!acc.endsWith("!!!")) {
                    return `${acc}_${word}`;
                }

                acc = acc.replace(/!!!$/, "");

                if (word === "up") {
                    return `${acc}_up`;
                }

                if (word.length >= 4) {
                    return `${acc}_${word}`;
                }

                return `${acc}${word}`;
            }, "")
            .replace(/!!!$/, "")
            //.join("_")
            //.replace(/!!!_up/, "_up")
            //.replace(/!!!$/, "")
            //.replace(/!!!_/, "")
            //.replace(/_2_tone$/, "_two_tone")
            .replace(/^co_2/, "co2")
            .replace(/$/, `${isTwoTone ? "_two_tone" : ""}_24px.svg`);
        /*
        .replace("_k_", "k_")
        .replace("_mp_", "mp_")
        .replace("_x_", "x_")
        .replace("_fps_", "fps_")
        .replace("3_d_", "3d_")
        .replace("3_g_", "3g_");
        */

        return iconFileName;
    }

    return { muiComponentNameToFileName };
})();
