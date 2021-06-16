import { objectKeys } from "tsafe/objectKeys";

export const breakpointsValues = {
    "xs": 0,
    "sm": 600,
    "md": 960,
    "lg": 1280,
    "xl": 1920,
} as const;

export type Breakpoint = keyof typeof breakpointsValues;

export type Responsive = {
    /** Up or equal */
    up(arg: Breakpoint | number): boolean;
    /** Strictly down */
    down(arg: Breakpoint | number): boolean;
    /** Up or equal and strictly down */
    between(start: Breakpoint | number, end: Breakpoint | number): boolean;
    /** Up or equal but strictly down next breakpoint */
    only(breakpoint: Breakpoint): boolean;
    /** Current value of window.innerWidth */
    windowInnerWidth: number;
};

export const { createResponsive } = (() => {
    const { getNextBreakpoint } = (() => {
        const ascendingOrderedBreakpoints = objectKeys(breakpointsValues).sort(
            (bpA, bpB) => breakpointsValues[bpA] - breakpointsValues[bpB],
        );

        function getNextBreakpoint(breakpoint: Breakpoint): Breakpoint | undefined {
            return ascendingOrderedBreakpoints[ascendingOrderedBreakpoints.indexOf(breakpoint) + 1];
        }

        return { getNextBreakpoint };
    })();

    function createResponsive(params: { windowInnerWidth: number }): Responsive {
        const { windowInnerWidth } = params;

        const out: Responsive = {
            "up": arg => windowInnerWidth >= (typeof arg === "number" ? arg : breakpointsValues[arg]),
            "down": arg => !out.up(arg),
            "between": (start, end) => out.up(start) && out.down(end),
            "only": breakpoint => out.between(breakpoint, getNextBreakpoint(breakpoint) ?? Infinity),
            windowInnerWidth,
        };

        return out;
    }

    return { createResponsive };
})();
