import { useRef } from "react";
import { createPageHeader } from "../PageHeader";
import type { PageHeaderProps } from "../PageHeader";
import { Icon } from "./theme";
import type { IconId } from "./theme";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";

const { PageHeader } = createPageHeader({ Icon });

function Component(
    props: Omit<
        PageHeaderProps<IconId>,
        "titleCollapseParams" | "helpCollapseParams"
    >,
) {
    const { ...rest } = props;

    const scrollableElementRef = useRef<HTMLDivElement>();

    return (
        <div
            style={{
                "height": 500,
                "display": "flex",
                "flexDirection": "column",
            }}
        >
            <PageHeader
                {...rest}
                titleCollapseParams={{
                    "behavior": "collapses on scroll",
                    "scrollTopThreshold": 500,
                    scrollableElementRef,
                }}
                helpCollapseParams={{
                    "behavior": "collapses on scroll",
                    "scrollTopThreshold": 200,
                    scrollableElementRef,
                }}
            />
            <span>Scroll below dit to trigger collapse</span>
            <div
                ref={scrollableElementRef}
                style={{
                    "flex": 1,
                    "border": "1px solid black",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "overflow": "auto",
                }}
            >
                {new Array(300).fill("").map(i => (
                    <div
                        key={i}
                        style={{
                            "border": "1px solid black",
                            "height": 100,
                            "flex": "200px",
                            "margin": 5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ PageHeader })]: Component },
    "defaultWidth": 750,
});

export default meta;

export const VueDefault = getStory({
    "helpContent": "This is the content of the help",
    "helpIcon": "sentimentSatisfied",
    "helpTitle": "This is the help title",
    "mainIcon": "home",
    "title": "This is the title",
});
