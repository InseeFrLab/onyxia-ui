import { Typography, defaultProps } from "../Typography";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";
import { css } from "tss-react";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Typography },
});

export default meta;

export const Vue1 = getStory({
    ...defaultProps,
    "children": "Lorem ipsum dolor sit amet",
});

export const VueWithOnClick = getStory({
    ...defaultProps,
    "children": "Lorem ipsum dolor sit amet",
    ...logCallbacks(["onClick"]),
});

export const VueWithCss = getStory({
    ...defaultProps,
    "children": "Lorem ipsum dolor sit amet",
    "className": css({ "backgroundColor": "blue" }),
});
