import type { NonPostableEvtLike } from "./NonPostableEvtLike";
import type { NonPostableEvt } from "evt";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";

export function useNonPostableEvtLike<
    E extends NonPostableEvtLike<unknown> | undefined,
>(
    evtLike: E,
): E extends undefined
    ? undefined
    : E extends NonPostableEvtLike<infer T>
    ? NonPostableEvt<T>
    : never {
    const evt = useGuaranteedMemo(() => Evt.create<any>(), [evtLike]);

    useEvt(
        ctx => {
            if (evtLike === undefined) {
                return;
            }
            evtLike.attach(ctx, data => evt.post(data));
        },
        [evtLike],
    );

    return (evtLike === undefined ? undefined : evt) as any;
}
