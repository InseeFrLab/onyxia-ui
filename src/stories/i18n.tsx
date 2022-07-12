import { createI18nApi, declareComponentKeys } from "i18nifty";

const { i18n } = declareComponentKeys<
    | "github picker label"
    | { K: "github picker create tag"; P: { tag: string } }
    | { K: "github picker done"; R: JSX.Element }
    | "something else"
>()({ "Picker": null });

export const { useTranslation } = createI18nApi<typeof i18n>()(
    {
        "languages": ["en", "fr"],
        "fallbackLanguage": "en",
    },
    {
        "en": {
            "Picker": {
                "github picker label": "Pick tag",
                "github picker create tag": ({ tag }) =>
                    `Create the "${tag}" tag`,
                "github picker done": <>Done</>,
                "something else": "ok",
            },
        },
        "fr": {
            "Picker": {
                "github picker label": undefined,
                "github picker create tag": undefined,
                "github picker done": undefined,
                "something else": undefined,
            },
        },
    },
);
