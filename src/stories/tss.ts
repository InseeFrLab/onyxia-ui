import { createTss } from "tss-react";
import { useTheme } from "../lib";
import { emotionCache } from "./emotionCache";
import { createCssAndCx } from "tss-react/cssAndCx";

/** NOTE: Used internally, do not export globally */
export const { tss } = createTss({
    useContext: function useTssContext() {
        const theme = useTheme();

        return { theme };
    },
});

/** NOTE: Used internally, do not export globally */
export const useStyles = tss.create({});

export const { css, cx } = createCssAndCx({ cache: emotionCache });
