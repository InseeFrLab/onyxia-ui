import { createButtonBarButton } from "../ButtonBarButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { Icon } from "./theme";

const { ButtonBarButton } = createButtonBarButton({
    "Icon": Icon,
});

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
