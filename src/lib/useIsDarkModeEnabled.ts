import { createUseGlobalState } from "powerhooks";
import type { StatefulEvt } from "powerhooks";

export function getIsDarkModeEnabledOsDefault() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const { useIsDarkModeEnabled, evtIsDarkModeEnabled: evtIsDarkModeEnabled_needsAnnotation } =
    createUseGlobalState("isDarkModeEnabled", getIsDarkModeEnabledOsDefault);

export { useIsDarkModeEnabled };

export const evtIsDarkModeEnabled: StatefulEvt<boolean> = evtIsDarkModeEnabled_needsAnnotation;

//NOTE: useClassNames -> useTheme -> useIsDarkModeEnabled -> one handler attached.
//There is one handler attached for every components loaded. It's normal and alright
//so we can disable memory leaks warnings.
evtIsDarkModeEnabled.setMaxHandlers(Infinity);
