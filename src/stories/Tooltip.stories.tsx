import { Tooltip } from "../Tooltip";
import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Tooltip },
});

export default meta;

export const Vue1 = getStory({
    "children": <Icon iconId="help" />,
    "title": "This is the title",
});
