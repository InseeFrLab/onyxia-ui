import { Icon } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { customIcons } from "./theme";
import type { MuiIconComponentName } from "../MuiIconComponentName";
import { id } from "tsafe/id";

const icons = [
    id<MuiIconComponentName>("Home"),
    id<MuiIconComponentName>("Help"),
    customIcons.tourSvgUrl,
    customIcons.servicesSvgUrl,
] as const;

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Icon },
    "argTypes": {
        "icon": {
            "options": icons,
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
    "icon": icons[0],
    "size": "default",
});
