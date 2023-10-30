import React from "react";
import { Tooltip } from "../Tooltip";
import { Icon } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import type { MuiIconComponentName } from "../MuiIconComponentName";
import { id } from "tsafe/id";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Tooltip },
});

export default meta;

export const Vue1 = getStory({
    "children": <Icon icon={id<MuiIconComponentName>("Help")} />,
    "title": "This is the title",
});
