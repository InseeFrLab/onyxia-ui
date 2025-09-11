import {
    defaultPalette_urgent,
    type PaletteOverrideLike,
} from "./lib/color.urgent";

export type { PaletteOverrideLike };

export type GetPaletteOverride = (params: {
    isDarkModeEnabled: boolean;
}) => PaletteOverrideLike;

/*
This is a way to get the correct background color as soon as possible,
even before the JavaScript bundle is evaluated.
It is to prevent a white flash when the user has dark mode enabled.
It is very implementation dependent and can easily break...
if it does no big deal.
*/
export function onyxiaUiEarlyInit(params: {
    isDarkModeEnabled_force: boolean | undefined;
    getPaletteOverride: GetPaletteOverride | undefined;
}) {
    const { isDarkModeEnabled_force, getPaletteOverride } = params;

    const isDarkModeEnabled = /true/.test(
        (() => {
            if (isDarkModeEnabled_force !== undefined) {
                return `${isDarkModeEnabled_force}`;
            }

            const KEY = "powerhooks_useGlobalState_isDarkModeEnabled";
            let value: string | null = null;

            try {
                value = new URLSearchParams(location.search).get(KEY);
            } catch {}

            if (value !== null) {
                return value;
            }

            try {
                value = localStorage.getItem(KEY);
            } catch {}

            if (value !== null) {
                return value;
            }

            try {
                value = window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "true"
                    : "false";
            } catch {}

            if (value !== null) {
                return value;
            }

            return "false";
        })(),
    );

    const backgroundColor = (() => {
        const paletteOverride = getPaletteOverride?.({ isDarkModeEnabled });

        const key = isDarkModeEnabled ? "dark" : "light";

        return paletteOverride?.[key]?.main ?? defaultPalette_urgent[key].main;
    })();

    document.documentElement.style.backgroundColor = backgroundColor;

    while (true) {
        const element = document.querySelector("meta[name=theme-color]");

        if (element === null) {
            break;
        }

        element.remove();
    }

    document.head.insertAdjacentHTML(
        "beforeend",
        '<meta name="theme-color" content="' + backgroundColor + '">',
    );
}
