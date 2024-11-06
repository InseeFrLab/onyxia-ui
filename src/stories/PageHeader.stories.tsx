import React from "react";
import { PageHeader, type PageHeaderProps } from "../PageHeader";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { useStateRef } from "powerhooks/useStateRef";
import type { MuiIconComponentName } from "../MuiIconComponentName";
import { id } from "tsafe/id";
import accountSvgUrl from "./assets/svg/account_v1.svg";

function Component(
    props: Omit<
        PageHeaderProps,
        "titleCollapseParams" | "helpCollapseParams"
    > & {
        transitionDuration: number;
    },
) {
    const { transitionDuration, ...rest } = props;

    const scrollableElementRef = useStateRef<HTMLDivElement>(null);

    return (
        <div
            style={{
                height: 500,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PageHeader
                {...rest}
                titleCollapseParams={{
                    behavior: "collapses on scroll",
                    scrollTopThreshold: 500,
                    scrollableElementRef,
                    transitionDuration,
                }}
                helpCollapseParams={{
                    behavior: "collapses on scroll",
                    scrollTopThreshold: 200,
                    scrollableElementRef,
                    transitionDuration,
                }}
            />
            <span>Scroll below dit to trigger collapse</span>
            <div
                ref={scrollableElementRef}
                style={{
                    flex: 1,
                    border: "1px solid black",
                    display: "flex",
                    flexWrap: "wrap",
                    overflow: "auto",
                }}
            >
                {new Array(300).fill("").map(i => (
                    <div
                        key={i}
                        style={{
                            border: "1px solid black",
                            height: 100,
                            flex: "200px",
                            margin: 5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { [symToStr({ PageHeader })]: Component },
    defaultWidth: 750,
});

export default meta;

export const VueDefault = getStory({
    helpContent: "This is the content of the help",
    helpIcon: id<MuiIconComponentName>("SentimentSatisfied"),
    helpTitle: "This is the help title",
    mainIcon: id<MuiIconComponentName>("Home"),
    title: "This is the title",
    transitionDuration: 250,
});

export const VueWithCustomIcon = getStory({
    helpContent: "This is the content of the help",
    helpIcon: accountSvgUrl,
    helpTitle: "This is the help title",
    mainIcon: accountSvgUrl,
    title: "This is the title",
    transitionDuration: 250,
});
