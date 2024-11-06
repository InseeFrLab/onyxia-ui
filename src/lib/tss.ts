import { createTss } from "tss-react";
import { useTheme } from "./theme";

/** NOTE: Used internally, do not export globally */
export const { tss } = createTss({
    useContext: function useTssContext() {
        const theme = useTheme();

        return { theme };
    },
});

/** NOTE: Used internally, do not export globally */
export const useStyles = tss.create({});
