import React from "react";
import { Tabs } from "../Tabs";
import type { TabProps } from "../Tabs";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { useState } from "react";
import { useConstCallback } from "powerhooks";

function Component(
    props: Omit<
        TabProps,
        "tabs" | "activeTabId" | "onRequestChangeActiveTab" | "children"
    > & {
        tabCount: number;
    },
) {
    const { tabCount, ...rest } = props;

    const [tabs] = useState(() =>
        new Array(tabCount).fill("").map(
            (...[, i]) =>
                ({
                    "id": `tab${i}`,
                    "title": `Tab ${i}`,
                } as const),
        ),
    );
    type TabId = (typeof tabs)[number]["id"];

    const [activeTabId, setActiveTabId] = useState<TabId>("tab0");

    const onRequestChangeActiveTab = useConstCallback<
        TabProps<TabId>["onRequestChangeActiveTab"]
    >(tabId => setActiveTabId(tabId));

    return (
        <Tabs
            tabs={tabs}
            activeTabId={activeTabId}
            onRequestChangeActiveTab={onRequestChangeActiveTab}
            {...rest}
        >
            <span>Tab selected: {activeTabId}</span>
        </Tabs>
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "defaultWidth": 700,
    "wrappedComponent": { [symToStr({ Tabs })]: Component },
});

export default meta;

export const VueSmall = getStory({
    "size": "small",
    "maxTabCount": 4,
    "tabCount": 9,
});

export const VueLarge = getStory({
    "size": "big",
    "maxTabCount": 4,
    "tabCount": 9,
});

export const VueAllTabsVisible = getStory({
    "size": "big",
    "maxTabCount": 10,
    "tabCount": 5,
});

export const NoArrowNeeded = getStory({
    "size": "big",
    "maxTabCount": 4,
    "tabCount": 4,
});

export const OnlyTwoTabs = getStory({
    "size": "big",
    "maxTabCount": 4,
    "tabCount": 2,
});

export const OnlyOneTab = getStory({
    "size": "big",
    "maxTabCount": 4,
    "tabCount": 1,
});
