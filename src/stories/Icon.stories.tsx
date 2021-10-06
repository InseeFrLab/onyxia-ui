import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import type { IconId } from "./theme";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

const iconIds = ["tour", "services", "help", "home"] as const;

assert<Equals<IconId, typeof iconIds[number]>>();

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Icon },
    "argTypes": {
        "iconId": {
            "options": iconIds,
            "control": { "type": "radio" },
        },
        "size": {
            "options": ["extra small", "small", "default", "medium", "large"],
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const Home = getStory({
    "iconId": "home",
    "size": "default",
});
