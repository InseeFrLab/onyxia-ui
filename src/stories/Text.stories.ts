import { Text } from "./theme";
import type { TypographyDesc } from "../lib/typography";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./geStory";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";

const variantNameBase = [
    "display heading",
    "page heading",
    "subtitle",
    "section heading",
    "object heading",
    "label 1",
    "label 2",
    "navigation label",
    "body 1",
    "body 2",
    "caption",
] as const;

doExtends<
    Any.Equals<TypographyDesc.VariantNameBase, typeof variantNameBase[number]>,
    1
>();

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Text },
    "argTypes": {
        "typo": {
            "options": variantNameBase,
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const Vue1 = getStory({
    "typo": "body 1",
    "children": "Lorem ipsum dolor sit amet",
});
