import { createTss, type CSSInterpolation } from "tss-react";
import { useTheme } from "../lib";

/** NOTE: Used internally, do not export globally */
export const { tss } = createTss({
    "useContext": function useTssContext() {
        const theme = useTheme();

        return { theme };
    },
});

/** NOTE: Used internally, do not export globally */
export const useStyles = tss.create({});

export function useCss(cssObject: CSSInterpolation) {
    const { css } = useStyles();
    return css(cssObject);
}
