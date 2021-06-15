import { useWindowInnerSize } from "powerhooks";
import { assert } from "tsafe/assert";
import { objectKeys } from "tsafe/objectKeys";

export const breakpointsValues = {
    "xs": 0,
    "sm": 600,
    "md": 960,
    "lg": 1280,
    "xl": 1920,
    "Xl": 1440,
} as const;

export type Breakpoint = keyof typeof breakpointsValues;

const sortedBreakpoints = objectKeys(breakpointsValues).sort(
    (bpA, bpB) => breakpointsValues[bpB] - breakpointsValues[bpA],
);

export function useBreakpoint(): Breakpoint {
    const { windowInnerWidth } = useWindowInnerSize();

    for (const key of sortedBreakpoints) {
        if (windowInnerWidth >= breakpointsValues[key]) {
            return key;
        }
    }

    assert(false);
}
