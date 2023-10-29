import React from "react";
import { useState } from "react";
import { LanguageSelect, type LanguageSelectProps } from "../LanguageSelect";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { id } from "tsafe/id";

const languagesPrettyPrint = {
    "en": "English",
    "fr": "Français",
};

type Language = keyof typeof languagesPrettyPrint;

function Component(
    props: Omit<
        LanguageSelectProps<Language>,
        "language" | "onLanguageChange" | "languagesPrettyPrint"
    >,
) {
    const [language, setLanguage] = useState<Language>("en");

    return (
        <LanguageSelect
            languagesPrettyPrint={languagesPrettyPrint}
            language={language}
            onLanguageChange={setLanguage}
            {...props}
        />
    );
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { [symToStr({ LanguageSelect })]: Component },
    "argTypes": {
        "variant": {
            "options": id<LanguageSelectProps<Language>["variant"][]>([
                "big",
                "small",
            ]),
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const VueNoTitle = getStory({
    "doShowIcon": true,
    "changeLanguageText": "Change language",
    "variant": "big",
});
