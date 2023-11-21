import { Evt } from "evt";
import { onlyIfChanged } from "evt/operators/onlyIfChanged";
import { memoize } from "./memoize";

export const getEvtWindowInnerSize = memoize(() => {
    const evtWindowInnerSize = Evt.from(window, "resize")
        .toStateful()
        .pipe(() => [
            {
                "windowInnerWidth": window.innerWidth,
                "windowInnerHeight": window.innerHeight,
            },
        ])
        .pipe(onlyIfChanged());

    return { evtWindowInnerSize };
});
