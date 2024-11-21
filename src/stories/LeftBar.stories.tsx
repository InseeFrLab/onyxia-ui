import { LeftBar } from "../LeftBar";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { customIcons } from "./theme";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { LeftBar },
});

export default meta;

export const VueNoTitle = getStory({
    defaultIsPanelOpen: true,
    doPersistIsPanelOpen: false,
    currentItemId: "item2",
    items: [
        {
            itemId: "item1",
            icon: customIcons.tourSvgUrl,
            label: "Item 1",
            link: {
                href: "https://example.com",
            },
        },
        {
            groupId: "group1",
        },
        {
            itemId: "item2",
            icon: customIcons.servicesSvgUrl,
            label: "Item two",
            link: {
                href: "#",
                onClick: () => console.log("click item 2"),
            },
        },
        {
            itemId: "item3",
            icon: HelpIcon,
            label: "Item three",
            link: {
                href: "#",
            },
            availability: "greyed",
        },
        {
            itemId: "item4",
            icon: HomeIcon,
            label: "The fourth item",
            link: {
                href: "#",
            },
        },
        {
            groupId: "group2",
        },
    ],
});
