import { IconButton } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import type { IconId } from "./theme";

const iconIds = ["tour", "services", "help", "home"] as const;

doExtends<Any.Equals<IconId, typeof iconIds[number]>, 1>();

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { IconButton },
    "argTypes": {
        "iconId": {
            "options": iconIds,
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const Vue = getStory({
    "iconId": "home",
    ...logCallbacks(["onClick"]),
});
