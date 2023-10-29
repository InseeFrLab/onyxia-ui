import React from "react";
import { useState } from "react";
import { SearchBar } from "../SearchBar";
import type { SearchBarProps } from "../SearchBar";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { symToStr } from "tsafe/symToStr";

function Component(props: Omit<SearchBarProps, "search" | "onSearchChange">) {
    const [search, setState] = useState("");

    return <SearchBar search={search} onSearchChange={setState} {...props} />;
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ SearchBar })]: Component },
    "defaultWidth": 700,
});

export default meta;

export const VueDefault = getStory({
    ...logCallbacks(["onKeyPress"]),
});
