import type { TypographyOptions as MuiTypographyOptions } from "@material-ui/core/styles/createTypography";

export type TypographyOptionsBase = typeof defaultTypography;

export const defaultTypography = {
    "fontFamily": '"Work Sans", sans-serif',
    "h1": {
        "fontWeight": "bold",
        "fontSize": "60px",
        "lineHeight": 1.2,
    },
    "h2": {
        "fontWeight": "bold",
        "fontSize": "36px",
        "lineHeight": 1.11,
    },
    "h3": {
        "fontWeight": 500,
        "fontSize": "28px",
        "lineHeight": 1.29,
    },
    "h4": {
        "fontWeight": "bold",
        "fontSize": "24px",
        "lineHeight": 1.33,
    },
    "h5": {
        "fontWeight": 600,
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "h6": {
        "fontWeight": 500,
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "subtitle1": {
        "fontWeight": 500,
        "fontSize": "18px",
        "lineHeight": 1.1,
    },
    "subtitle2": {
        "fontWeight": 500,
        "fontSize": "14px",
        "lineHeight": 1.2,
    },
    "body1": {
        "fontWeight": "normal",
        "fontSize": "18px",
        "lineHeight": 1.1,
    },
    "body2": {
        "fontWeight": "normal",
        "fontSize": "14px",
        "lineHeight": 1.1,
    },
    "button": {
        "fontWeight": 600,
        "fontSize": "20px",
        "lineHeight": 1.2,
    },
    "caption": {
        "fontWeight": "normal",
        "fontSize": "14px",
        "lineHeight": 1,
    },
} as const;

export function createMuiTypographyOptions(params: {
    typography: TypographyOptionsBase;
}): MuiTypographyOptions {
    const { typography } = params;

    return {
        ...typography,
        "fontWeightRegular": "normal",
        "fontWeightMedium": 500,
    } as const;
}
