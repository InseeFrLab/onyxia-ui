import { Button } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Button },
});

export default meta;

export const VueNoIcon = getStory({
    "children": "Default",
    ...logCallbacks(["onClick"]),
});

export const VueWithStartIcon = getStory({
    "children": "Foo bar",
    "startIcon": "home",
    ...logCallbacks(["onClick"]),
});
