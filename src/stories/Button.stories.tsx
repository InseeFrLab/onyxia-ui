import { Button, buttonDefaultProps } from "../Button";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Button },
});

export default meta;

export const VueNoIcon = getStory({
    ...buttonDefaultProps,
    "children": "Default",
    ...logCallbacks(["onClick"]),
});

export const VueWithStartIcon = getStory({
    ...buttonDefaultProps,
    "children": "Foo bar",
    "startIcon": "home",
    ...logCallbacks(["onClick"]),
});
