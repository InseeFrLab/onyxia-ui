import { Icon, defaultProps } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Icon },
});

export default meta;

export const Home = getStory({ ...defaultProps, "type": "home" });
