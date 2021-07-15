import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import type { IconId } from "./theme";

const iconIds = ["tour", "services", "help", "home"] as const;

doExtends<Any.Equals<IconId, typeof iconIds[number]>, 1>();

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
