import { createPageHeader } from "../PageHeader";
import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { PageHeader } = createPageHeader({ Icon });

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { PageHeader },
    "defaultWidth": 750,
});

export default meta;

export const VueDefault = getStory({
    "helpContent": "This is the content of the help",
    "helpIcon": "sentimentSatisfied",
    "helpTitle": "This is the help title",
    "mainIcon": "home",
    "title": "This is the title",
});
