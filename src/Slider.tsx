import { memo } from "react";
import { SimpleOrRangeSlider } from "./RangeSlider/SimpleOrRangeSlider";
import { SimpleOrRangeSliderProps } from "./RangeSlider/SimpleOrRangeSlider";
import { useConstCallback } from "powerhooks/useConstCallback";

export type SliderProps = Omit<
    SimpleOrRangeSliderProps,
    | "lowExtremitySemantic"
    | "highExtremitySemantic"
    | "valueLow"
    | "valueHigh"
    | "onValueChange"
> & {
    semantic?: string;
    value: number;
    onValueChange(value: number): void;
};

export const Slider = memo((props: SliderProps) => {
    const { value, onValueChange, semantic, ...rest } = props;

    const onSimpleOrRangeSliderValueChange = useConstCallback<
        SimpleOrRangeSliderProps["onValueChange"]
    >(({ value }) => onValueChange(value));

    return (
        <SimpleOrRangeSlider
            highExtremitySemantic={semantic}
            valueHigh={value}
            onValueChange={onSimpleOrRangeSliderValueChange}
            {...rest}
        />
    );
});
