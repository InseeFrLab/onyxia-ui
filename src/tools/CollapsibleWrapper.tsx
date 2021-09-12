import { useState, useEffect, useRef, memo } from "react";
import type { RefObject } from "react";
import { useDomRect } from "powerhooks/useDomRect";
import type { ReactNode } from "react";
import { useCssAndCx } from "tss-react";
import { Evt } from "evt";
import { useElementEvt } from "evt/hooks";

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
    const {
        ref: rootRef,
        domRect: { height: rootHeight },
    } = useDomRect();

    const { css, cx } = useCssAndCx();

    const [isCollapsedIfDependsOfScroll, setIsCollapsedIfDependsOfScroll] =
        useState(false);

    useEffect(() => {
        if (rest.behavior !== "collapses on scroll") {
            return;
        }

        rest.onIsCollapsedValueChange?.(isCollapsedIfDependsOfScroll);
    }, [isCollapsedIfDependsOfScroll]);

    const dummyRef = useRef<HTMLDivElement>();

    useElementEvt<HTMLDivElement>(
        ({ ctx, element, registerSideEffect }) => {
            if (rest.behavior !== "collapses on scroll") {
                return;
            }

            const { scrollTopThreshold } = rest;

            Evt.from(ctx, element, "scroll")
                .pipe(event => [(event as any).target.scrollTop as number])
                .toStateful(element.scrollTop)
                .attach(scrollTop =>
                    registerSideEffect(() =>
                        setIsCollapsedIfDependsOfScroll(isCollapsed =>
                            isCollapsed
                                ? scrollTop + rootHeight * 1.05 >
                                  scrollTopThreshold
                                : scrollTop > scrollTopThreshold,
                        ),
                    ),
                );
        },
        rest.behavior !== "collapses on scroll"
            ? dummyRef
            : rest.scrollableElementRef,
        [
            rest.behavior,
            ...(rest.behavior !== "collapses on scroll"
                ? [Object, Object]
                : [rest.scrollTopThreshold, rest.scrollableElementRef]),
        ],
    );

    const isCollapsed = (() => {
        switch (rest.behavior) {
            case "collapses on scroll":
                return isCollapsedIfDependsOfScroll;
            case "controlled":
                return rest.isCollapsed;
        }
    })();

    return (
        <div
            ref={rootRef}
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
