import { ButtonBar } from "../ButtonBar";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { ButtonBar },
});

export default meta;

export const VueDefault = getStory({
    "buttons": [
        {
            "buttonId": "btn1",
            "icon": "help",
            "isDisabled": false,
            "label": "Label 1",
        },
        {
            "buttonId": "btn2",
            "icon": "home",
            "isDisabled": false,
            "label": "Label 2",
        },
        {
            "buttonId": "btn3",
            "icon": "services",
            "isDisabled": true,
            "label": "Label 3",
        },
        {
            "buttonId": "btn4",
            "icon": "tour",
            "isDisabled": false,
            "label": "Label 4",
        },
    ] as const,
    ...logCallbacks(["onClick"]),
});
