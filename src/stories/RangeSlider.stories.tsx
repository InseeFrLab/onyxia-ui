import React from "react";
import { RangeSlider } from "../RangeSlider";
import type { RangeSliderProps } from "../RangeSlider";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { useState } from "react";
import { symToStr } from "tsafe/symToStr";
import { useConstCallback } from "powerhooks/useConstCallback";

function Component(
    props: Omit<RangeSliderProps, "onValueChange" | "valueHigh" | "valueLow">,
) {
    const [valueLow, setValueLow] = useState(props.min);
    const [valueHigh, setValueHigh] = useState(props.max);

    const onValueChange = useConstCallback<RangeSliderProps["onValueChange"]>(
        ({ valueLow, valueHigh }) => {
            setValueLow(valueLow);
            setValueHigh(valueHigh);
        },
    );

    return (
        <RangeSlider
            {...props}
            valueLow={valueLow}
            valueHigh={valueHigh}
            onValueChange={onValueChange}
        />
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { [symToStr({ RangeSlider })]: Component },
});

export default meta;

export const Vue1 = getStory({
    label: "Random-access memory (RAM)",
    lowExtremitySemantic: "guaranteed",
    highExtremitySemantic: "maximum",
    unit: "Mi",
    min: 900,
    max: 1100,
    step: 1,
});
