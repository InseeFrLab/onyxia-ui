import { breakpointsValues } from "./responsive";

export type SpacingConfig = (params: {
    factor: number;
    windowInnerWidth: number;
    rootFontSizePx: number;
}) => number;

export const defaultSpacingConfig: SpacingConfig = ({ factor, windowInnerWidth, rootFontSizePx }) =>
    rootFontSizePx *
    (() => {
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
