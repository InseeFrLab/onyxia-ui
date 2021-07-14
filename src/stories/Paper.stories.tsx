import { Paper } from "../Paper";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";
import { css } from "tss-react";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Paper },
});

export default meta;

export const Vue1 = getStory({
    "children": <div className={css({ "width": 400, "height": 400 })}></div>,
    "elevation": 3,
});
