import { css } from "tss-react";
import { useReducer, useState } from "react";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { Breadcrump } from "../Breadcrump";
import type { BreadcrumpProps } from "../Breadcrump";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import type { UnpackEvt } from "evt";
import { Evt } from "evt";

function Component(
    props: Omit<BreadcrumpProps, "evtAction"> & {
        width: number;
        /** Toggle to fire a translation event */
        tick: boolean;
    },
) {
    const { tick, minDepth, path, callback, isNavigationDisabled, width } =
        props;

    const [index, incrementIndex] = useReducer((index: number) => index + 1, 0);

    useEffectOnValueChange(() => {
        incrementIndex();
    }, [tick]);

    const [evtAction] = useState(() =>
        Evt.create<UnpackEvt<BreadcrumpProps["evtAction"]>>(),
    );

    useEffectOnValueChange(() => {
        evtAction.post({
            "action": "DISPLAY COPY FEEDBACK",
            "basename": "foo.svg",
        });
    }, [evtAction, index]);

    return (
        <Breadcrump
            isNavigationDisabled={isNavigationDisabled}
            className={css({
                "border": "1px solid black",
                width,
            })}
            evtAction={evtAction}
            minDepth={minDepth}
            path={path}
            callback={callback}
        />
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ Breadcrump })]: Component },
    "argTypes": {
        "width": {
            "control": {
                "type": "range",
                "min": 200,
                "max": 1920,
                "step": 10,
            },
        },
        "tick": {
            "control": {
                "type": "boolean",
            },
        },
    },
});

export default meta;

export const Vue1 = getStory({
    "path": "aaa/bbb/cccc/dddd/",
    "isNavigationDisabled": false,
    "minDepth": 0,
    "width": 800,
    "tick": true,
    ...logCallbacks(["callback"]),
});

export const VueMinDepthNot0 = getStory({
    "path": "aaa/bbb/cccc/dddd/",
    "isNavigationDisabled": false,
    "minDepth": 1,
    "width": 800,
    "tick": true,
    ...logCallbacks(["callback"]),
});

export const VueFromRoot = getStory({
    "path": "/aaa/bbb/cccc/dddd/",
    "isNavigationDisabled": false,
    "minDepth": 2,
    "width": 800,
    "tick": true,
    ...logCallbacks(["callback"]),
});
