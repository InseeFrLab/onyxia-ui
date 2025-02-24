import { Text } from "../Text";
import type { TypographyDesc } from "../lib/typography";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

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
    "body 3",
    "caption",
] as const;

{
    type A = TypographyDesc.VariantNameBase;
    type B = (typeof variantNameBase)[number];

    type X = Exclude<A, B>;
    type Y = Exclude<B, A>;

    assert<Equals<X, never>>();
    assert<Equals<Y, never>>();
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { Text },
    argTypes: {
        typo: {
            options: variantNameBase,
            control: { type: "radio" },
        },
    },
});

export default meta;

export const Vue1 = getStory({
    typo: "body 1",
    children: "Lorem ipsum dolor sit amet",
});
