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
    >(({ valueHigh }) => onValueChange(valueHigh));

    return (
        <SimpleOrRangeSlider
            className={rest.className}
            inputId={rest.inputId}
            min={rest.min}
            max={rest.max}
            step={rest.step}
            unit={rest.unit}
            lowExtremitySemantic={undefined}
            highExtremitySemantic={semantic}
            label={rest.label}
            extraInfo={rest.extraInfo}
            valueLow={NaN}
            valueHigh={value}
            onValueChange={onSimpleOrRangeSliderValueChange}
        />
    );
});
