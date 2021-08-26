import { SimpleOrRangeSlider } from "./SimpleOrRangeSlider";
import type { SimpleOrRangeSliderProps } from "./SimpleOrRangeSlider";
import type { ReactComponent } from "../tools/ReactComponent";

export type RangeSliderProps = Omit<SimpleOrRangeSliderProps, "valueLow"> & {
    valueLow: number;
};

export const RangeSlider: ReactComponent<RangeSliderProps> =
    SimpleOrRangeSlider;
