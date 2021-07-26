import { DarkModeSwitch } from "../DarkModeSwitch";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DarkModeSwitch },
});

export default meta;

export const VueDefault = getStory({});
