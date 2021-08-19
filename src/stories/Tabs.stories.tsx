import { Tabs } from "../Tabs";
import type { TabProps } from "../Tabs";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { useState } from "react";
import { useConstCallback } from "powerhooks";

const tabs = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(
    i =>
        ({
            "id": `tab${i}`,
            "title": `Tab ${i}`,
        } as const),
);
type TabId = typeof tabs[number]["id"];

function Component(
    props: Omit<
        TabProps,
        "tabs" | "activeTabId" | "onRequestChangeActiveTab" | "children"
    >,
) {
    const [activeTabId, setActiveTabId] = useState<TabId>("tab5");

    const onRequestChangeActiveTab = useConstCallback<
        TabProps<TabId>["onRequestChangeActiveTab"]
    >(tabId => setActiveTabId(tabId));

    return (
        <Tabs
            tabs={tabs}
            activeTabId={activeTabId}
            onRequestChangeActiveTab={onRequestChangeActiveTab}
            {...props}
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
});

export const VueLarge = getStory({
    "size": "big",
    "maxTabCount": 4,
});
