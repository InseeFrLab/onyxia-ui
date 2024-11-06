import { IconButton } from "../IconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
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
    wrappedComponent: { IconButton },
    argTypes: {
        icon: {
            options: icons,
            control: { type: "radio" },
        },
    },
});

export default meta;

export const Vue = getStory({
    icon: icons[0],
    ...logCallbacks(["onClick"]),
});
