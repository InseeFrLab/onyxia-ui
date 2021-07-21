import { Button } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "argTypes": {
        "variant": {
            "options": ["primary", "secondary", "ternary"],
            "control": { "type": "radio" },
        },
    },
    "wrappedComponent": { Button },
});

export default meta;

export const VueNoIcon = getStory({
    "children": "Default",
    "variant": "primary",
    ...logCallbacks(["onClick"]),
});

export const VueWithStartIcon = getStory({
    "children": "Foo bar",
    "startIcon": "help",
    "variant": "primary",
    ...logCallbacks(["onClick"]),
});
