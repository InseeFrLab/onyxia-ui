import { createLeftBar } from "../LeftBar";
import { Icon } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { LeftBar } = createLeftBar({
    Icon,
    "persistIsPanelOpen": false,
});

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { LeftBar },
});

export default meta;

export const VueNoTitle = getStory({
    "currentItemId": "item2",
    "items": {
        "item1": {
            "iconId": "tour",
            "label": "Item 1",
            "link": {
                "href": "https://example.com",
            },
        },
        "item2": {
            "iconId": "services",
            "label": "Item two",
            "link": {
                "href": "#",
                "onClick": () => console.log("click item 2"),
            },
        },
        "item3": {
            "iconId": "help",
            "label": "Item three",
            "hasDividerBelow": true,
            "link": {
                "href": "#",
            },
        },
        "item4": {
            "iconId": "home",
            "label": "The fourth item",
            "link": {
                "href": "#",
            },
        },
    },
});
