import { useEffect, useState, memo } from "react";
import { useDomRect } from "powerhooks/useDomRect";
import type { ReactNode } from "react";
import { Evt } from "evt";
import { useElementEvt } from "evt/hooks";
import { getScrollableParent } from "powerhooks/getScrollableParent";
import { makeStyles } from "./lib/ThemeProvider";
import { useMergedClasses } from "tss-react/compat";

export type CollapseParams =
    | CollapseParams.Controlled
    | CollapseParams.CollapsesOnScroll;
export namespace CollapseParams {
    export type Common = {
        /** Default 250ms */
        transitionDuration?: number;
        classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    };

    export type Controlled = Common & {
        behavior: "controlled";
        isCollapsed: boolean;
    };

    export type CollapsesOnScroll = Common & {
        behavior: "collapses on scroll";
        scrollTopThreshold: number;
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

    const [isCollapsedIfDependsOfScroll, setIsCollapsedIfDependsOfScroll] =
        useState(false);

    useEffect(() => {
        if (rest.behavior !== "collapses on scroll") {
            return;
        }

        rest.onIsCollapsedValueChange?.(isCollapsedIfDependsOfScroll);
    }, [isCollapsedIfDependsOfScroll]);

    useElementEvt<HTMLDivElement>(
        ({ ctx, element: childrenWrapperElement, registerSideEffect }) => {
            if (rest.behavior !== "collapses on scroll") {
                return;
            }

            const { scrollTopThreshold } = rest;

            const scrollElement = getScrollableParent(childrenWrapperElement);

            Evt.from(ctx, scrollElement, "scroll")
                .pipe(event => [(event as any).target.scrollTop as number])
                .toStateful(scrollElement.scrollTop)
                .attach(scrollTop =>
                    registerSideEffect(() =>
                        setIsCollapsedIfDependsOfScroll(
                            //scrollTop > scrollTopThreshold,
                            isCollapsedIfDependsOfScroll =>
                                isCollapsedIfDependsOfScroll
                                    ? scrollTop + childrenWrapperHeight * 1.3 >
                                      scrollTopThreshold
                                    : scrollTop > scrollTopThreshold,
                        ),
                    ),
                );
        },
        childrenWrapperRef,
        rest.behavior !== "collapses on scroll"
            ? [null, null]
            : [rest.scrollTopThreshold, childrenWrapperHeight],
    );

    let { classes, cx } = useStyles({
        "isCollapsed": (() => {
            switch (rest.behavior) {
                case "collapses on scroll":
                    return isCollapsedIfDependsOfScroll;
                case "controlled":
                    return rest.isCollapsed;
            }
        })(),
        childrenWrapperHeight,
        transitionDuration,
    });

    classes = useMergedClasses(classes, props.classes);

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.inner} ref={childrenWrapperRef}>
                {children}
                <div className={classes.bottomDivForSpacing} />
            </div>
        </div>
    );
});

const useStyles = makeStyles<{
    isCollapsed: boolean;
    childrenWrapperHeight: number;
    transitionDuration: number;
}>({ "name": { CollapsibleWrapper } })(
    (_theme, { childrenWrapperHeight, isCollapsed, transitionDuration }) => ({
        "root": {
            "height": isCollapsed ? 0 : childrenWrapperHeight || undefined,
            "opacity": isCollapsed ? 0 : 1,
            "transition": ["height", "padding", "margin", "opacity"]
                .map(prop => `${prop} ${transitionDuration}ms`)
                .join(", "),
            "overflow": "hidden",
        },
        "inner": {},
        "bottomDivForSpacing": {
            //height: 30
        },
    }),
);
