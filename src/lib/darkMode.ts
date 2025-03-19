import { useContext } from "react";
import { createContext } from "react";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { getSearchParam } from "powerhooks/tools/urlSearchParams";
import { updateSearchBarUrl } from "powerhooks/tools/updateSearchBar";
import type { StatefulEvt } from "evt";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";

const GLOBAL_CONTEXT_KEY = "__onyxia-ui.darkMode.globalContext";

declare global {
    interface Window {
        [GLOBAL_CONTEXT_KEY]: {
            initialLocationHref: string;
        };
    }
}

window[GLOBAL_CONTEXT_KEY] ??= {
    initialLocationHref: window.location.href,
};

const globalContext = window[GLOBAL_CONTEXT_KEY];

const { initialLocationHref } = globalContext;

type Context = {
    isDarkModeEnabled: boolean;
    setIsDarkModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export const isDarkModeEnabledContext = createContext<Context | undefined>(
    undefined,
);

export function useDarkMode() {
    const contextValue = useContext(isDarkModeEnabledContext);

    if (contextValue === undefined) {
        throw new Error("Your app should be wrapped into <OnyxiaUi />");
    }

    return contextValue;
}

export function createUseIsDarkModeEnabledGlobalState(params: {
    defaultIsDarkModeEnabled: boolean;
}) {
    const { defaultIsDarkModeEnabled } = params;

    const { $isDarkModeEnabled } = createUseGlobalState({
        name: "isDarkModeEnabled",
        initialState: defaultIsDarkModeEnabled,
        doPersistAcrossReloads: true,
    });

    const evtIsDarkModeEnabled: StatefulEvt<boolean> =
        statefulObservableToStatefulEvt({
            statefulObservable: $isDarkModeEnabled,
        });

    (() => {
        const URL_PARAM_NAME = "theme";

        const { wasPresent, value } = getSearchParam({
            url: initialLocationHref,
            name: URL_PARAM_NAME,
        });

        if (!wasPresent) {
            return;
        }

        {
            const { wasPresent, url_withoutTheParam } = getSearchParam({
                url: window.location.href,
                name: URL_PARAM_NAME,
            });

            if (wasPresent) {
                updateSearchBarUrl(url_withoutTheParam);
            }
        }

        const isDarkModeEnabled = (() => {
            switch (value) {
                case "dark":
                    return true;
                case "light":
                    return false;
                default:
                    return undefined;
            }
        })();

        if (isDarkModeEnabled === undefined) {
            return;
        }

        evtIsDarkModeEnabled.state = isDarkModeEnabled;
    })();

    evtIsDarkModeEnabled.attach(isDarkModeEnabled => {
        {
            const id = "root-color-scheme";

            remove_existing_element: {
                const element = document.getElementById(id);

                if (element === null) {
                    break remove_existing_element;
                }

                element.remove();
            }

            const element = document.createElement("style");

            element.id = id;

            element.innerHTML = `
				:root {
					color-scheme: ${isDarkModeEnabled ? "dark" : "light"}
				}
		`;

            document.getElementsByTagName("head")[0].appendChild(element);
        }

        // To enable custom css stylesheets to target a specific theme
        document.documentElement.setAttribute(
            "theme",
            isDarkModeEnabled ? "dark" : "light",
        );
    });

    return evtIsDarkModeEnabled;
}
