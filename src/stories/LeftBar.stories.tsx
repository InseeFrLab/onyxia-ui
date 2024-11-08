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
    items: {
        item1: {
            icon: customIcons.tourSvgUrl,
            label: "Item 1",
            link: {
                href: "https://example.com",
            },
        },
        item2: {
            icon: customIcons.servicesSvgUrl,
            label: "Item two",
            link: {
                href: "#",
                onClick: () => console.log("click item 2"),
            },
        },
        item3: {
            icon: HelpIcon,
            label: "Item three",
            belowDivider: true,
            link: {
                href: "#",
            },
            availability: "greyed",
        },
        item4: {
            icon: HomeIcon,
            label: "The fourth item",
            link: {
                href: "#",
            },
        },
    },
});
