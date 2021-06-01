import { IconButton, defaultProps } from "../IconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { IconButton },
});

export default meta;

export const Vue = getStory({
    ...defaultProps,
    "type": "add",
    ...logCallbacks(["onClick"]),
});
