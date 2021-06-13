import { useTheme } from "@material-ui/core/styles";
import { useWindowInnerSize } from "powerhooks";
import type { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { doExtends } from "tsafe/doExtends";

export type { Breakpoint };

const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;

doExtends<typeof breakpoints[number], Breakpoint>();
doExtends<Breakpoint, typeof breakpoints[number]>();

export function useBreakpoint(): Breakpoint {
    const theme = useTheme();

    const { windowInnerWidth } = useWindowInnerSize();

    let key: Breakpoint | undefined;

    for (const key_i of breakpoints) {
        if (windowInnerWidth >= theme.breakpoints.width(key_i)) {
            key = key_i;
            break;
        }
    }

    if (key === undefined) {
        key = "xs";
    }

    return key;
}
