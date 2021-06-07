import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Icon },
});

export default meta;

export const Home = getStory({ "id": "home" });
