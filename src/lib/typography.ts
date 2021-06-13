import type { TypographyOptions as MuiTypographyOptions } from "@material-ui/core/styles/createTypography";
import { id } from "tsafe/id";

export type FontWeightProperty =
    | FontWeightProperty.Globals
    | FontWeightProperty.FontWeightAbsolute
    | "bolder"
    | "lighter";
export declare namespace FontWeightProperty {
    export type FontWeightAbsolute = number | "bold" | "normal";
    export type Globals = "-moz-initial" | "inherit" | "initial" | "revert" | "unset";
}

export type TypographyOptionsBase = typeof defaultTypography;

export const defaultTypography = {
    "fontFamily": "sans-serif",
    "h1": {
        "fontWeight": id<FontWeightProperty>("bold"),
        "fontSize": "60px",
        "lineHeight": 1.2,
    },
    "h2": {
        "fontWeight": id<FontWeightProperty>("bold"),
        "fontSize": "36px",
        "lineHeight": 1.11,
    },
    "h3": {
        "fontWeight": id<FontWeightProperty>(500),
        "fontSize": "28px",
        "lineHeight": 1.29,
    },
    "h4": {
        "fontWeight": id<FontWeightProperty>("bold"),
        "fontSize": "24px",
        "lineHeight": 1.33,
    },
    "h5": {
        "fontWeight": id<FontWeightProperty>(600),
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "h6": {
        "fontWeight": id<FontWeightProperty>(500),
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "subtitle1": {
        "fontWeight": id<FontWeightProperty>(500),
        "fontSize": "18px",
        "lineHeight": 1.1,
    },
    "subtitle2": {
        "fontWeight": id<FontWeightProperty>(500),
        "fontSize": "14px",
        "lineHeight": 1.2,
    },
    "body1": {
        "fontWeight": id<FontWeightProperty>("normal"),
        "fontSize": "18px",
        "lineHeight": 1.1,
    },
    "body2": {
        "fontWeight": id<FontWeightProperty>("normal"),
        "fontSize": "14px",
        "lineHeight": 1.1,
    },
    "button": {
        "fontWeight": id<FontWeightProperty>(600),
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "caption": {
        "fontWeight": id<FontWeightProperty>("normal"),
        "fontSize": "14px",
        "lineHeight": 1,
    },
};

export function createMuiTypographyOptions(params: {
    typography: TypographyOptionsBase;
}): MuiTypographyOptions {
    const { typography } = params;

    return {
        ...typography,
        "fontWeightRegular": "normal",
        "fontWeightMedium": 500,
    };
}
