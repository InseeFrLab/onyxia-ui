import { GitHubPicker } from "../GitHubPicker";
import { Button } from "./theme";
import { useStateRef } from "powerhooks/useStateRef";
import { useState } from "react";
import type { GitHubPickerProps } from "../GitHubPicker";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { Evt } from "evt";
import type { UnpackEvt } from "evt";
import { useConst } from "powerhooks/useConst";
import { assert } from "tsafe/assert";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ GitHubPicker })]: Component },
});

export default meta;

function getTagColor(tag: string) {
    return getBackgroundColor(tag);
}

function getBackgroundColor(stringInput: string) {
    const h = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const s = 95,
        l = 35 / 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function Component() {
    const evtGitHubPickerAction = useConst(() =>
        Evt.create<UnpackEvt<GitHubPickerProps["evtAction"]>>(),
    );

    const [tags, setTags] = useState([
        "oauth",
        "sso",
        "datascience",
        "office",
        "docker",
    ]);

    const [selectedTags, setSelectedTags] = useState(["oauth", "docker"]);

    const buttonRef = useStateRef<HTMLButtonElement>(null);

    return (
        <div>
            {selectedTags.map(tag => (
                <span key={tag}>{tag}&nbsp;</span>
            ))}
            <br />
            <Button
                ref={buttonRef}
                onClick={() =>
                    evtGitHubPickerAction.post({
                        "action": "open",
                        "anchorEl":
                            (assert(buttonRef.current !== null),
                            buttonRef.current),
                        "onSelectedTags": selectedTags => {
                            setTags([
                                ...tags,
                                ...selectedTags.filter(
                                    tag => !tags.includes(tag),
                                ),
                            ]);
                            setSelectedTags(selectedTags);
                        },
                        "preSelectedTags": selectedTags,
                        tags,
                    })
                }
            >
                open
            </Button>
            <GitHubPicker
                evtAction={evtGitHubPickerAction}
                getTagColor={getTagColor}
                t={(_, { tag }) => `Create tag ${tag}`}
                label="Software tags"
            />
        </div>
    );
}

export const VueDefault = getStory({});
