import { IconButton } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";

import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { IconId } from "./theme";

const iconIds = ["tour", "services", "help", "home"] as const;

assert<Equals<IconId, typeof iconIds[number]>>();

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
