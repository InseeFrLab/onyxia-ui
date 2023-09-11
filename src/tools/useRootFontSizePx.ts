import { useState } from "react";
import { useEvt } from "evt/hooks/useEvt";
import { Evt } from "evt";
import { assert } from "tsafe/assert";

function getRootFontSizePx() {
    const value = window
        .getComputedStyle(window.document.documentElement)
        .getPropertyValue("font-size");

    const match = value.match(/(\d+)px/);

    assert(match !== null);

    return parseFloat(match[1]);
}

export function useRootFontSizePx() {
    const [rootFontSizePx, setRootFontSizePx] = useState(getRootFontSizePx);

    // Can change if the user change it's font size preferences in the browser.
    useEvt(
        ctx =>
            Evt.from(ctx, window, "focus").attach(() =>
                setRootFontSizePx(getRootFontSizePx()),
            ),
        [],
    );

    return { rootFontSizePx };
}
