import { Button } from "../Button";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import type { MuiIconComponentName } from "../MuiIconComponentName";
import { id } from "tsafe/id";

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

export const WithLazilyDownloadedIcon = getStory({
    "children": "Foo bar",
    "startIcon": id<MuiIconComponentName>("AccountCircle"),
    "variant": "primary",
    ...logCallbacks(["onClick"]),
});

export const WithManuallyAddedIcons = getStory({
    "children": "Foo bar",
    "startIcon": id<MuiIconComponentName>("Google"),
    "variant": "primary",
    ...logCallbacks(["onClick"]),
});
