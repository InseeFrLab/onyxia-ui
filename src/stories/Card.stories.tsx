import { Card } from "../Card";
import { Text } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Card },
});

export default meta;

export const VueNoTitle = getStory({
    "children": <Text typo="body 1">I am the body</Text>,
});

export const VueWithDivider = getStory({
    "aboveDivider": <Text typo="object heading">This is the title</Text>,
    "children": <Text typo="body 1">I am the body</Text>,
});
