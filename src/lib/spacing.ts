import { breakpointsValues } from "./responsive";
import { assert } from "tsafe/assert";

/** Return number of pixel */
export type SpacingConfig = (params: {
    /** Assert positive integer */
    factor: number;
    windowInnerWidth: number;
    rootFontSizePx: number;
}) => number;

export const defaultSpacingConfig: SpacingConfig = ({
    factor,
    windowInnerWidth,
    rootFontSizePx,
}) =>
    rootFontSizePx *
    (function callee(factor: number): number {
        assert(factor >= 0, "factor must be positive");

        if (!Number.isInteger(factor)) {
            return (
                (callee(Math.floor(factor)) + callee(Math.floor(factor) + 1)) /
                2
            );
        }

        if (factor === 0) {
            return 0;
        }

        if (factor > 6) {
            return (factor - 5) * callee(6);
        }

        if (windowInnerWidth >= breakpointsValues.xl) {
            switch (factor) {
                case 1:
                    return 0.25;
                case 2:
                    return 0.5;
                case 3:
                    return 1;
                case 4:
                    return 1.5;
                case 5:
                    return 2;
                case 6:
                    return 2.5;
            }
        }

        if (windowInnerWidth >= breakpointsValues.lg) {
            switch (factor) {
                case 1:
                    return 0.25;
                case 2:
                    return 0.5;
                case 3:
                    return 1;
                case 4:
                    return 1;
                case 5:
                    return 1.5;
                case 6:
                    return 2;
            }
        }

        switch (factor) {
            case 1:
                return 0.25;
            case 2:
                return 0.25;
            case 3:
                return 0.5;
            case 4:
                return 1;
            case 5:
                return 1;
            case 6:
                return 1.5;
        }

        assert(false);
    })(factor);
