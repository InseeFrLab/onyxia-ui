export function getIsDarkModeEnabledOsDefault() {
    return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
}
