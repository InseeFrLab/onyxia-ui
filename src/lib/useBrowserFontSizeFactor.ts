import { useEvt, useRerenderOnStateChange } from "evt/hooks";
import { Evt } from "evt";
import memoize from "memoizee";

export const getBrowserFontSizeFactor = memoize(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rootElement = document.querySelector("html")!;

    const { fontSize } = rootElement.style;

    rootElement.style.fontSize = "100%";

    const browserFontSizeFactor =
        parseInt(
            window.getComputedStyle(rootElement, null).getPropertyValue("font-size").replace(/px$/, ""),
        ) / 16;

    rootElement.style.fontSize = fontSize;

    console.log({ browserFontSizeFactor });

    return browserFontSizeFactor;
});

export function useBrowserFontSizeFactor() {
    const evtBrowserFontSizeFactor = useEvt(
        ctx =>
            Evt.from(ctx, window, "focus")
                .toStateful()
                .pipe(() => {
                    getBrowserFontSizeFactor.clear();
                    return [getBrowserFontSizeFactor()];
                }),
        [],
    );

    useRerenderOnStateChange(evtBrowserFontSizeFactor);

    return { "browserFontSizeFactor": evtBrowserFontSizeFactor.state };
}
