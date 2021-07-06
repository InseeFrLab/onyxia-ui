import {} from "./theme";
import { Text } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Text },
});

export default meta;

export const Vue1 = getStory({
    "typo": "body 1",
    "children": "Lorem ipsum dolor sit amet",
});
