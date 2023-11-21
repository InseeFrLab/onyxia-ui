import { Evt } from "evt";
import { onlyIfChanged } from "evt/operators/onlyIfChanged";
import { assert } from "tsafe/assert";
import { memoize } from "./memoize";

export const getEvtRootFontSizePx = memoize(() => {
    const evtRootFontSizePx = Evt.merge([
        (() => {
            const evtRootStyleMutation = Evt.create();

            const observer = new MutationObserver(() => {
                evtRootStyleMutation.post();
            });

            [document.body, document.documentElement].forEach(element =>
                observer.observe(element, {
                    "attributes": true,
                    "attributeFilter": ["style"],
                }),
            );

            return evtRootStyleMutation;
        })(),
        Evt.from(window, "focus"),
    ])
        .toStateful()
        .pipe(() => {
            const value = window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("font-size");

            const match = value.match(/(\d+)px/);

            assert(match !== null);

            const rootFontSizePx = parseFloat(match[1]);

            return [rootFontSizePx];
        })
        .pipe(onlyIfChanged());

    return { evtRootFontSizePx };
});
