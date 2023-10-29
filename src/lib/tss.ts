import { useContext } from "react";
import { createTss } from "tss-react";
import { themeContext } from "./ThemeProvider";

/** NOTE: Used internally, do not export globally */
export const { tss } = createTss({
    "useContext": function useTssContext() {
        const theme = useContext(themeContext);

        if (theme === undefined) {
            throw new Error("Your app should be wrapped into ThemeProvider");
        }

        return { theme };
    },
});

/** NOTE: Used internally, do not export globally */
export const useStyles = tss.create({});
