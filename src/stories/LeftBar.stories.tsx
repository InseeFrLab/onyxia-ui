import { LeftBar } from "../LeftBar";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { id } from "tsafe/id";
import type { CustomIconId } from "./theme";
import type { MuiIconsComponentName } from "../MuiIconsComponentName";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { LeftBar },
});

export default meta;

export const VueNoTitle = getStory({
    "defaultIsPanelOpen": true,
    "doPersistIsPanelOpen": false,
    "currentItemId": "item2",
    "items": {
        "item1": {
            "iconId": id<CustomIconId>("tour"),
            "label": "Item 1",
            "link": {
                "href": "https://example.com",
            },
        },
        "item2": {
            "iconId": id<CustomIconId>("services"),
            "label": "Item two",
            "link": {
                "href": "#",
                "onClick": () => console.log("click item 2"),
            },
        },
        "item3": {
            "iconId": id<MuiIconsComponentName>("Help"),
            "label": "Item three",
            "belowDivider": true,
            "link": {
                "href": "#",
            },
            "availability": "greyed",
        },
        "item4": {
            "iconId": id<MuiIconsComponentName>("Home"),
            "label": "The fourth item",
            "link": {
                "href": "#",
            },
        },
    },
});
