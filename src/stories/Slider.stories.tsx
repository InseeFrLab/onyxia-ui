import React from "react";
import { Slider } from "../Slider";
import type { SliderProps } from "../Slider";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { useState } from "react";
import { symToStr } from "tsafe/symToStr";

function Component(props: Omit<SliderProps, "onValueChange" | "value">) {
    const [value, setValue] = useState(props.min);
    return <Slider {...props} value={value} onValueChange={setValue} />;
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { [symToStr({ Slider })]: Component },
});

export default meta;

export const Vue1 = getStory({
    label: "Random-access memory (RAM)",
    extraInfo: "This is some extra infos",
    semantic: "maximum",
    unit: "Mi",
    min: 1,
    max: 200,
    step: 1,
});

export const VueNoSemantic = getStory({
    label: "Random-access memory (RAM)",
    unit: "Mi",
    min: 1,
    max: 200,
    step: 1,
});
