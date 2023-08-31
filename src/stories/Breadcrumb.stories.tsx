import { useReducer, useState } from "react";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { Breadcrumb } from "../Breadcrumb";
import type { BreadcrumbProps } from "../Breadcrumb";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import type { UnpackEvt } from "evt";
import { Evt } from "evt";

function Component(
    props: Omit<BreadcrumbProps, "evtAction"> & {
        /** Toggle to fire a translation event */
        tick: boolean;
    },
) {
    const {
        tick,
        minDepth,
        path,
        onNavigate,
        isNavigationDisabled,
        separatorChar,
    } = props;

    const [index, incrementIndex] = useReducer((index: number) => index + 1, 0);

    useEffectOnValueChange(() => {
        incrementIndex();
    }, [tick]);

    const [evtAction] = useState(() =>
        Evt.create<UnpackEvt<BreadcrumbProps["evtAction"]>>(),
    );

    useEffectOnValueChange(() => {
        evtAction.post({
            "action": "DISPLAY COPY FEEDBACK",
            "basename": "foo.svg",
        });
    }, [evtAction, index]);

    return (
        <Breadcrumb
            isNavigationDisabled={isNavigationDisabled}
            evtAction={evtAction}
            minDepth={minDepth}
            path={path}
            separatorChar={separatorChar}
            onNavigate={onNavigate}
        />
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ Breadcrumb })]: Component },
    "argTypes": {
        "tick": {
            "control": {
                "type": "boolean",
            },
        },
    },
});

export default meta;

export const VueDefault = getStory({
    "path": ["aaa", "bbb", "cccc", "dddd"],
    "isNavigationDisabled": false,
    "minDepth": 0,
    "tick": true,
    ...logCallbacks(["onNavigate"]),
});

export const VueOtherSeparator = getStory({
    "path": ["aaa", "bbb", "cccc", "dddd"],
    "separatorChar": "/",
    "isNavigationDisabled": false,
    "minDepth": 0,
    "tick": true,
    ...logCallbacks(["onNavigate"]),
});

export const VueMinDepth2 = getStory({
    "path": ["aaa", "bbb", "cccc", "dddd"],
    "separatorChar": "/",
    "isNavigationDisabled": false,
    "minDepth": 2,
    "tick": true,
    ...logCallbacks(["onNavigate"]),
});

export const VueFromRoot = getStory({
    "path": ["", "aaa", "bbb", "cccc", "dddd"],
    "isNavigationDisabled": false,
    "minDepth": 0,
    "tick": true,
    ...logCallbacks(["onNavigate"]),
});

export const VueStartFromCwd = getStory({
    "path": [".", "aaa", "bbb", "cccc", "dddd"],
    "isNavigationDisabled": false,
    "minDepth": 0,
    "tick": true,
    ...logCallbacks(["onNavigate"]),
});
