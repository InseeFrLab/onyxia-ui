import { useEffect, useReducer, useRef, memo } from "react";
import type { RefObject } from "react";
import { useDomRect } from "powerhooks/useDomRect";
import type { ReactNode } from "react";
import { useCssAndCx } from "tss-react/compat";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { useStateRef } from "powerhooks/useStateRef";

export type CollapseParams =
    | CollapseParams.Controlled
    | CollapseParams.CollapsesOnScroll;
export namespace CollapseParams {
    export type Common = {
        /** Default 250ms */
        transitionDuration?: number;
    };

    export type Controlled = Common & {
        behavior: "controlled";
        isCollapsed: boolean;
    };

    export type CollapsesOnScroll = Common & {
        behavior: "collapses on scroll";
        scrollTopThreshold: number;
        scrollableElementRef: RefObject<any>;
        onIsCollapsedValueChange?: (isCollapsed: boolean) => void;
    };
}

export type CollapsibleWrapperProps = {
    className?: string;
    children: ReactNode;
} & CollapseParams;

export const CollapsibleWrapper = memo((props: CollapsibleWrapperProps) => {
    const { className, transitionDuration = 250, children, ...rest } = props;

    const {
        ref: childrenWrapperRef,
        domRect: { height: childrenWrapperHeight },
    } = useDomRect();

    const { css, cx } = useCssAndCx();

    //We use a ref instead of a state because we want to be able to
    //synchronously reset the state when the div that scrolls have been changed
    const isCollapsedIfDependsOfScrollRef = useRef(false);

    useGuaranteedMemo(() => {
        isCollapsedIfDependsOfScrollRef.current = false;
    }, [
        rest.behavior === "collapses on scroll"
            ? rest.scrollableElementRef.current ?? Object
            : Object,
    ]);

    useEffect(() => {
        if (rest.behavior !== "collapses on scroll") {
            return;
        }

        rest.onIsCollapsedValueChange?.(
            isCollapsedIfDependsOfScrollRef.current,
        );
    }, [isCollapsedIfDependsOfScrollRef.current]);

    const dummyRef = useStateRef<HTMLDivElement>(null);

    {
        const ref =
            rest.behavior !== "collapses on scroll"
                ? dummyRef
                : rest.scrollableElementRef;

        const [, forceUpdate] = useReducer(counter => counter + 1, 0);

        useEvt(
            ctx => {
                const element = ref.current;

                if (!element) {
                    return;
                }

                if (rest.behavior !== "collapses on scroll") {
                    return;
                }

                const { scrollTopThreshold } = rest;

                Evt.from(ctx, element, "scroll")
                    .pipe(event => [(event as any).target.scrollTop as number])
                    .toStateful(element.scrollTop)
                    .attach(scrollTop => {
                        isCollapsedIfDependsOfScrollRef.current =
                            isCollapsedIfDependsOfScrollRef.current
                                ? scrollTop + childrenWrapperHeight * 1.3 >
                                  scrollTopThreshold
                                : scrollTop > scrollTopThreshold;

                        forceUpdate();
                    });
            },
            [
                rest.behavior,
                ...(rest.behavior !== "collapses on scroll"
                    ? [null, null, null]
                    : [
                          rest.scrollTopThreshold,
                          rest.scrollableElementRef,
                          childrenWrapperHeight,
                      ]),
            ],
        );
    }

    const isCollapsed = (() => {
        switch (rest.behavior) {
            case "collapses on scroll":
                return isCollapsedIfDependsOfScrollRef.current;
            case "controlled":
                return rest.isCollapsed;
        }
    })();

    return (
        <div
            className={cx(
                css({
                    "height": isCollapsed
                        ? 0
                        : childrenWrapperHeight || undefined,
                    "opacity": isCollapsed ? 0 : 1,
                    "transition": ["height", "padding", "margin", "opacity"]
                        .map(prop => `${prop} ${transitionDuration}ms`)
                        .join(", "),
                    "overflow": "hidden",
                }),
                className,
            )}
        >
            <div ref={childrenWrapperRef}>{children}</div>
        </div>
    );
});
