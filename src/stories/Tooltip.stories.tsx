import React from "react";
import { Tooltip } from "../Tooltip";
import { Icon } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import type { MuiIconsComponentName } from "../MuiIconsComponentName";
import { id } from "tsafe/id";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Tooltip },
});

export default meta;

export const Vue1 = getStory({
    "children": <Icon iconId={id<MuiIconsComponentName>("Help")} />,
    "title": "This is the title",
});
