import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulEvt } from "powerhooks/useGlobalState";

export function getIsDarkModeEnabledOsDefault() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const { useIsDarkModeEnabled, evtIsDarkModeEnabled: evtIsDarkModeEnabled_needsAnnotation } =
    createUseGlobalState("isDarkModeEnabled", getIsDarkModeEnabledOsDefault);

export { useIsDarkModeEnabled };

export const evtIsDarkModeEnabled: StatefulEvt<boolean> = evtIsDarkModeEnabled_needsAnnotation;
