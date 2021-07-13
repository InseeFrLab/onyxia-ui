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
    (() => {
        assert(Number.isInteger(factor), "Factor should be an integer");

        if (windowInnerWidth >= breakpointsValues.xl) {
            return 0.5 * factor;
        }
        if (windowInnerWidth >= breakpointsValues.lg) {
            return 0.5 * factor - (factor >= 2 ? 0.5 : 0);
        }
        return (() => {
            switch (factor) {
                case 0:
                    return 0;
                case 1:
                    return 0.25;
                case 2:
                case 3:
                    return 0.5;
                case 4:
                    return 1;
                case 5:
                    return 1.5;
                default:
                    return 1.5 + (factor - 5) * 0.5;
            }
        })();
    })();
