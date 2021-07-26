import { DarkModeSwitch } from "../DarkModeSwitch";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DarkModeSwitch },
    "argTypes": {
        "size": {
            "options": ["extra small", "small", "default", "medium", "large"],
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const VueDefault = getStory({
    "size": "default",
});
