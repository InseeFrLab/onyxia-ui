import { useContext } from "react";
import { createContext } from "react";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import {
    updateSearchBarUrl,
    retrieveParamFromUrl,
} from "powerhooks/tools/urlSearchParams";
import type { StatefulEvt } from "evt";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";

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
        "name": "isDarkModeEnabled",
        "initialState": defaultIsDarkModeEnabled,
        "doPersistAcrossReloads": true,
    });

    const evtIsDarkModeEnabled: StatefulEvt<boolean> =
        statefulObservableToStatefulEvt({
            "statefulObservable": $isDarkModeEnabled,
        });

    (() => {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            "name": "theme",
        });

        if (!result.wasPresent) {
            return;
        }

        updateSearchBarUrl(result.newUrl);

        const isDarkModeEnabled = (() => {
            switch (result.value) {
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
    });

    return evtIsDarkModeEnabled;
}
