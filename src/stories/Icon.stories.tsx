import { Icon } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
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
    "iconId": id<MuiIconsComponentName>("Home"),
    "size": "default",
});
