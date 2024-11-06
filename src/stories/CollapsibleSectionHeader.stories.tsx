import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { CollapsibleSectionHeader },
    defaultWidth: 600,
});

export default meta;

export const VueCollapsed = getStory({
    isCollapsed: true,
    title: "This is the name of the section",
    total: 123,
    ...logCallbacks(["onToggleIsCollapsed"]),
});

export const VueExpanded = getStory({
    isCollapsed: false,
    title: "This is the name of the section",
    total: 123,
    ...logCallbacks(["onToggleIsCollapsed"]),
});
