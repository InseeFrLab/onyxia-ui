import { Tag } from "../Tag";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { css } from "./tss";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Tag },
});

export default meta;

export const VueDefault = getStory({
    "text": "Machine learning",
});

export const VueCustom = getStory({
    "className": css({
        "backgroundColor": "pink",
        "& > p": {
            "color": "black",
        },
    }),
    "text": "Machine learning",
});
