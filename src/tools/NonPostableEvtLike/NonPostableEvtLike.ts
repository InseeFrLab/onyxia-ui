import type { CtxLike } from "evt";

export type NonPostableEvtLike<T> = {
    attach: (ctx: CtxLike, callback: (data: T) => void) => any;
};
