import { Tooltip } from "../Tooltip";
import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Tooltip },
});

export default meta;

export const Vue1 = getStory({
    "children": <Icon id="help" />,
    "title": "This is the title",
});
