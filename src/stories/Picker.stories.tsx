import React from "react";
import { Picker } from "../Picker";
import type { PickerProps } from "../Picker";
import { Button } from "../Button";
import { useStateRef } from "powerhooks/useStateRef";
import { useState } from "react";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { Evt } from "evt";
import type { UnpackEvt } from "evt";
import { useConst } from "powerhooks/useConst";
import { assert } from "tsafe/assert";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useTranslation } from "./i18n";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ Picker })]: Component },
});

export default meta;

function getTagColor(tag: string) {
    return getRandomColor(tag);
}

function getRandomColor(stringInput: string) {
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
        Evt.create<UnpackEvt<PickerProps["evtAction"]>>(),
    );

    const [options, setOptions] = useState(
        ["oauth", "sso", "datascience", "office", "docker"].map(tag => ({
            "id": tag,
            "label": tag,
        })),
    );

    const [selectedOptionIds, setSelectedOptionIds] = useState([
        "oauth",
        "docker",
    ]);

    const buttonRef = useStateRef<HTMLButtonElement>(null);

    const onSelectedOption = useConstCallback<PickerProps["onSelectedOption"]>(
        params => {
            if (params.isSelect && params.isNewOption) {
                setSelectedOptionIds([
                    params.optionLabel,
                    ...selectedOptionIds,
                ]);
                setOptions([
                    ...options,
                    {
                        "id": params.optionLabel,
                        "label": params.optionLabel,
                    },
                ]);
            }

            setSelectedOptionIds(
                params.isSelect
                    ? [
                          ...selectedOptionIds,
                          params.isNewOption
                              ? params.optionLabel
                              : params.optionId,
                      ]
                    : selectedOptionIds.filter(id => id !== params.optionId),
            );
        },
    );

    const { t } = useTranslation({ Picker });

    return (
        <div>
            {selectedOptionIds.map(id => (
                <span key={id}>{id}&nbsp;</span>
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
                    })
                }
            >
                open
            </Button>
            <Picker
                options={options}
                selectedOptionIds={selectedOptionIds}
                onSelectedOption={onSelectedOption}
                evtAction={evtGitHubPickerAction}
                getOptionColor={getTagColor}
                texts={{
                    "label": t("github picker label"),
                    "create option": ({ optionLabel }) =>
                        t("github picker create tag", { "tag": optionLabel }),
                    "done": t("github picker done"),
                }}
            />
        </div>
    );
}

export const VueDefault = getStory({});
