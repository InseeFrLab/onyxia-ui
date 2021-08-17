import { SimpleOrRangeSlider } from "./SimpleOrRangeSlider";
import type { SimpleOrRangeSliderProps } from "./SimpleOrRangeSlider";
import { ComponentType } from "../tools/ComponentType";

export type RangeSliderProps = Omit<SimpleOrRangeSliderProps, "valueLow"> & {
    valueLow: number;
};

export const RangeSlider: ComponentType<RangeSliderProps> = SimpleOrRangeSlider;
