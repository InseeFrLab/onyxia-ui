import { useState } from "react";
import { createLanguageSelect } from "../LanguageSelect";
import type { LanguageSelectProps } from "../LanguageSelect";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { symToStr } from "tsafe/symToStr";
import { id } from "tsafe/id";

const languagesPrettyPrint = {
    "en": "English",
    "fr": "Français",
};

const { LanguageSelect } = createLanguageSelect({
    languagesPrettyPrint,
});

type Language = keyof typeof languagesPrettyPrint;

function Component(
    props: Omit<LanguageSelectProps<Language>, "language" | "onLanguageChange">,
) {
    const [language, setLanguage] = useState<Language>("en");

    return (
        <LanguageSelect
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
            "options": id<LanguageSelectProps["variant"][]>([
                "for footer",
                "for header",
            ]),
            "control": { "type": "radio" },
        },
    },
});

export default meta;

export const VueNoTitle = getStory({
    "doShowIcon": true,
    "tooltipText": "Change language",
    "variant": "for header",
});
