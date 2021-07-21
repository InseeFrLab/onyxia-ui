import type { MutableRefObject, LegacyRef, RefCallback } from "react";
import { useCallback } from "react";

//TODO: Move in powerhooks
export function useMergeRefs<T = any>(
    refs: (MutableRefObject<T> | LegacyRef<T>)[],
): RefCallback<T> {
    return useCallback(
        value => {
            refs.forEach(ref => {
                if (typeof ref === "function") {
                    ref(value);
                } else if (ref != null) {
                    (ref as MutableRefObject<T | null>).current = value;
                }
            });
        },
        refs.map(ref => ref ?? Object),
    );
}
