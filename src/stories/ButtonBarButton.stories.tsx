import { ButtonBarButton } from "../ButtonBarButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { ButtonBarButton },
});

export default meta;

export const VueDefault = getStory({
    "children": "Click me",
    "disabled": false,
    "startIcon": "services",
    ...logCallbacks(["onClick"]),
});
