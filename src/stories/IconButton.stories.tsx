import { IconButton } from "../IconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import type { CustomIconId } from "./theme";
import type { MuiIconsComponentName } from "../MuiIconsComponentName";
import { id } from "tsafe/id";

const iconIds = [
    id<CustomIconId>("tour"),
    id<CustomIconId>("services"),
    id<MuiIconsComponentName>("Help"),
    id<MuiIconsComponentName>("Home"),
] as const;

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
    "iconId": id<MuiIconsComponentName>("Home"),
    ...logCallbacks(["onClick"]),
});
