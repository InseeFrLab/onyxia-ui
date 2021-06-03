import { IconButton, iconButtonDefaultProps } from "../IconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { IconButton },
});

export default meta;

export const Vue = getStory({
    ...iconButtonDefaultProps,
    "type": "add",
    ...logCallbacks(["onClick"]),
});
