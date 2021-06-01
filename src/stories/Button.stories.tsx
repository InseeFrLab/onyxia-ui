import { Button, defaultProps } from "../Button";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Button },
});

export default meta;

export const VueNoIcon = getStory({
    ...defaultProps,
    "children": "Default",
    ...logCallbacks(["onClick"]),
});

export const Vue1 = getStory({
    ...defaultProps,
    "children": "Foo bar",
    "startIcon": "home",
    ...logCallbacks(["onClick"]),
});
