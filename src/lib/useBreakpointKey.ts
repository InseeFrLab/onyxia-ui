import { useTheme } from "@material-ui/core/styles";
import { useWindowInnerSize } from "powerhooks";

export const breakpointKeys = ["xl", "lg", "md", "sm", "xs"] as const;

export type BreakpointKey = typeof breakpointKeys[number];

export function useBreakpointKey() {
    const theme = useTheme();

    const { windowInnerWidth } = useWindowInnerSize();

    let bp: BreakpointKey | undefined;

    for (const breakpointKey of breakpointKeys) {
        if (windowInnerWidth >= theme.breakpoints.width(breakpointKey)) {
            bp = breakpointKey;
            break;
        }
    }

    if (bp === undefined) {
        bp = "xs";
    }

    return { bp };
}
