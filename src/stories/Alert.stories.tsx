import * as React from "react";
import { Alert } from "../Alert";
import { Text } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Alert },
    "defaultWidth": 500,
});

export default meta;

export const VueNoTitle = getStory({
    "doDisplayCross": true,
    "severity": "success",
    "children": <Text typo="body 1">This is the text</Text>,
});
