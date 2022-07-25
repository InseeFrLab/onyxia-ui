import type { NonPostableEvtLike, NonPostableEvt, UnpackEvt } from "evt";
import { Evt } from "evt";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { useEvt } from "evt/hooks";

export function useNonPostableEvtLike<
    E extends NonPostableEvtLike<unknown> | undefined,
>(evtLike: E): NonPostableEvt<UnpackEvt<E>> {
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
