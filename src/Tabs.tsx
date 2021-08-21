import { Text } from "./Text/TextBase";
import { createIcon } from "./Icon";
import chevronLeft from "@material-ui/icons/ChevronLeft";
import { makeStyles } from "./lib/ThemeProvider";
import { useState, useMemo, useEffect, memo, forwardRef } from "react";
import type { ReactNode } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useDomRect } from "powerhooks";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import { Evt } from "evt";
import { useElementEvt } from "evt/hooks/useElementEvt";
import { useEvt } from "evt/hooks/useEvt";
import { objectKeys } from "tsafe/objectKeys";

const { Icon } = createIcon({
    chevronLeft,
});

export type TabProps<TabId extends string = string> = {
    className?: string;
    tabs: TabProps.Tab<TabId>[];
    activeTabId: TabId;
    size?: "big" | "small";
    maxTabCount: number;
    onRequestChangeActiveTab(tabId: TabId): void;
    children: ReactNode;
};

export declare namespace TabProps {
    export type Tab<TabId extends string> = {
        id: TabId;
        title: string;
    };
}

const useStyles = makeStyles<{
    tabsWrapperWidth: number;
    leftArrowWidth: number;
    leftArrowHeight: number;
    offset: number;
    tabWidth: number;
}>()(
    (
        theme,
        { tabsWrapperWidth, leftArrowWidth, leftArrowHeight, offset, tabWidth },
    ) => {
        const arrows = {
            "top": 0,
            "zIndex": 1,
            "position": "absolute",
        } as const;

        return {
            "root": {
                "backgroundColor": theme.colors.useCases.surfaces.surface1,
                "visibility": tabWidth === 0 ? "hidden" : "visible",
            },
            "top": {
                "overflow": "hidden",
                "position": "relative",
            },
            "leftArrow": {
                ...arrows,
                "left": 0,
            },
            "rightArrow": {
                ...arrows,
                "right": 0,
            },
            "tabsWrapper": {
                "transition": "left 250ms",
                "transitionTimingFunction": "ease",
                "position": "relative",
                "left": offset * tabWidth,
                "transform": `translateX(${leftArrowWidth}px)`,
                "zIndex": 0,
                "width": tabsWrapperWidth,
                "display": "flex",
            },
            "tab": {
                "flex": 1,
                "height": leftArrowHeight,
            },
            "content": {
                "padding": theme.spacing(4),
            },
        };
    },
);

export function Tabs<TabId extends string = string>(props: TabProps<TabId>) {
    const {
        className,
        tabs,
        activeTabId,
        onRequestChangeActiveTab,
        maxTabCount,
        size = "big",
        children,
    } = props;

    const [offset, setOffset] = useState(0);

    const {
        ref: rootRef,
        domRect: { width: rootWidth },
    } = useDomRect<HTMLDivElement>();
    const {
        ref: leftArrowRef,
        domRect: { width: leftArrowWidth, height: leftArrowHeight },
    } = useDomRect();

    const tabWidth = useMemo(
        () => (rootWidth - 2 * leftArrowWidth) / maxTabCount,
        [rootWidth, leftArrowWidth, maxTabCount],
    );

    const tabsWrapperWidth = useMemo(
        () => tabWidth * tabs.length,
        [tabWidth, tabs.length],
    );

    const { classes, cx, css } = useStyles({
        tabsWrapperWidth,
        leftArrowWidth,
        leftArrowHeight,
        offset,
        tabWidth,
    });

    const areArrowsVisible = tabs.length > maxTabCount;

    const [firstTabIndex, setFirstTabIndex] = useState(0);

    const onArrowClickFactory = useCallbackFactory(
        ([direction]: ["left" | "right"]) => {
            const delta = (() => {
                switch (direction) {
                    case "left":
                        return -1;
                    case "right":
                        return +1;
                }
            })();

            setFirstTabIndex(firstTabIndex + delta);

            setOffset(offset - delta);
        },
    );

    const isLeftArrowDisabled = firstTabIndex === 0;
    const isRightArrowDisabled = tabs.length - firstTabIndex === maxTabCount;

    const { ref: tabWrapperRef } = useElementEvt<HTMLDivElement>(
        ({ ctx, element }) =>
            Evt.from(ctx, element, "wheel").attach(wheelEvent => {
                wheelEvent.preventDefault();

                const direction = wheelEvent.deltaY < 0 ? "left" : "right";

                switch (direction) {
                    case "left":
                        if (isLeftArrowDisabled) {
                            return;
                        }
                        break;
                    case "right":
                        if (isRightArrowDisabled) {
                            return;
                        }
                        break;
                }

                onArrowClickFactory(direction)();
            }),
        [firstTabIndex, offset],
    );

    const [evtDraggedTabId] = useState(() =>
        Evt.create<TabId | undefined>(undefined),
    );

    const [dragOffset, setDragOffset] = useState(0);

    const [relativePositionByTabId, setRelativePositionByTabId] = useState<
        Record<TabId, number>
    >(() => {
        const out: Record<TabId, number> = {} as any;

        tabs.forEach(({ id }) => (out[id] = 0));

        return out;
    });

    {
        const d = ~~(dragOffset / tabWidth + (dragOffset < 0 ? -1 / 2 : 1 / 2));
        const [evtD] = useState(() => Evt.create<number>(d));

        useEffect(() => {
            const tabToMoveId = (() => {
                if (evtDraggedTabId.state === undefined) {
                    return "";
                }

                const draggedTabIndex = tabs.findIndex(
                    tab => tab.id === evtDraggedTabId.state,
                );

                const out = (() => {
                    if (evtD.state < d) {
                        return evtD.state < 0
                            ? draggedTabIndex + d
                            : draggedTabIndex + d + 1;
                    }
                    if (evtD.state === 0) {
                        return draggedTabIndex;
                    }
                    if (evtD.state < 0) {
                        return draggedTabIndex + evtD.state;
                    }
                    return draggedTabIndex + evtD.state + 1;
                })();

                return `tab${out}`;
            })();

            (relativePositionByTabId as any)[tabToMoveId] +=
                evtD.state < d ? -1 : 1;

            setRelativePositionByTabId({ ...relativePositionByTabId });

            evtD.post(d);
        }, [d]);
    }

    //console.log(relativePositionByTabId);

    const onTabClickFactory = useCallbackFactory(([id]: [TabId]) => {
        evtDraggedTabId.state = id;
        onRequestChangeActiveTab(id);
    });

    useEvt(
        ctx =>
            evtDraggedTabId
                .pipe(ctx)
                .attach(
                    draggedTabId => draggedTabId === undefined,
                    () => setDragOffset(0),
                )
                .attach(
                    draggedTabId => draggedTabId !== undefined,
                    () => {
                        const ctxBis = Evt.newCtx();

                        ctx.evtDoneOrAborted.attach(ctxBis, () =>
                            ctxBis.done(),
                        );

                        {
                            let initialPageX: number;

                            Evt.from(ctxBis, document, "mousemove")
                                .attachOnce(
                                    ({ pageX, movementX }) =>
                                        (initialPageX = pageX - movementX),
                                )
                                .attach(({ pageX }) =>
                                    setDragOffset(pageX - initialPageX),
                                );
                        }

                        Evt.from(ctxBis, document, "mouseup").attachOnce(() => {
                            evtDraggedTabId.state = undefined;
                            ctxBis.done();
                        });
                    },
                ),
        [],
    );

    return (
        <div className={cx(classes.root, className)} ref={rootRef}>
            <div className={classes.top}>
                {areArrowsVisible && (
                    <Tab
                        ref={leftArrowRef}
                        type="arrow"
                        direction="left"
                        size={size}
                        isFirst={false}
                        className={classes.leftArrow}
                        isDisabled={isLeftArrowDisabled}
                        isSelected={false}
                        onMouseDown={onArrowClickFactory("left")}
                        isVisible={true}
                    />
                )}
                <div ref={tabWrapperRef} className={classes.tabsWrapper}>
                    {tabs
                        .map(({ id, ...rest }) => ({
                            id,
                            "isSelected": id === activeTabId,
                            ...rest,
                        }))
                        .map(({ id, title, isSelected }, i) => (
                            <Tab
                                type="tab"
                                text={title}
                                size={size}
                                isDisabled={false}
                                isFirst={i === 0}
                                className={cx(
                                    classes.tab,
                                    css({
                                        "zIndex":
                                            maxTabCount -
                                            relativePositionByTabId[id] +
                                            (isSelected ? 1 : -i),
                                        "left":
                                            relativePositionByTabId[id] *
                                                tabWidth +
                                                (evtDraggedTabId.state === id
                                                    ? dragOffset
                                                    : 0) || undefined,
                                    }),
                                )}
                                key={id}
                                onMouseDown={onTabClickFactory(id)}
                                isSelected={isSelected}
                                isVisible={
                                    i >= firstTabIndex &&
                                    i < firstTabIndex + maxTabCount
                                }
                            />
                        ))}
                </div>
                {areArrowsVisible && (
                    <Tab
                        type="arrow"
                        direction="right"
                        size={size}
                        isFirst={false}
                        className={classes.rightArrow}
                        isDisabled={isRightArrowDisabled}
                        isSelected={false}
                        onMouseDown={onArrowClickFactory("right")}
                        isVisible={true}
                    />
                )}
            </div>

            <div className={classes.content}>{children}</div>
        </div>
    );
}

const { Tab } = (() => {
    type TabProps = {
        size: "big" | "small";
        className?: string;
        isDisabled: boolean;
        isSelected: boolean;
        isFirst: boolean;
        isVisible: boolean;
        onMouseDown(): void;
    } & (
        | {
              type: "arrow";
              direction: "left" | "right";
          }
        | {
              type: "tab";
              text: string;
          }
    );

    const useStyles = makeStyles<
        Pick<
            TabProps,
            "isSelected" | "isFirst" | "size" | "isDisabled" | "isVisible"
        > & {
            arrowDirection: undefined | "left" | "right";
        }
    >()(
        (
            theme,
            {
                isSelected,
                isFirst,
                size,
                isDisabled,
                arrowDirection,
                isVisible,
            },
        ) => ({
            "root": {
                "position": "relative",
                "backgroundColor":
                    theme.colors.useCases.surfaces[
                        isSelected ? "surface1" : "surface2"
                    ],
                "boxShadow":
                    arrowDirection === undefined && isVisible
                        ? [
                              theme.shadows[4],
                              ...(isSelected || isFirst
                                  ? [theme.shadows[5]]
                                  : []),
                          ].join(", ")
                        : (() => {
                              switch (arrowDirection) {
                                  case "right":
                                      return `inset ${theme.shadows[4]}`;
                                  case "left":
                                      return `inset ${theme.shadows[5]}`;
                              }
                          })(),
                "padding": (() => {
                    switch (size) {
                        case "big":
                            return theme.spacing(3, 4);
                        case "small":
                            return theme.spacing(2, 3);
                    }
                })(),
                "display": "flex",
                "alignItems": "center",
                "cursor": !isDisabled ? "pointer" : "default",
            },
            "typo": {
                "fontWeight": isSelected ? 600 : undefined,
            },
        }),
    );

    const Tab = memo(
        forwardRef<any, TabProps>((props, ref) => {
            const {
                onMouseDown: props_onMouseDown,
                className,
                size,
                isDisabled,
                isSelected,
                isFirst,
                isVisible,
                //For the forwarding, rest should be empty (typewise)
                ...restTmp
            } = props;

            const rest = (() => {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    children,
                    ...restTmp2
                } = restTmp;

                switch (restTmp2.type) {
                    case "arrow": {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { type, direction, ...out } = restTmp2;
                        return out;
                    }
                    case "tab": {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { type, text, ...out } = restTmp2;
                        return out;
                    }
                }
            })();

            const onMouseDown = useConstCallback(
                (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    e.preventDefault();
                    //On right click do nothing.
                    if (isDisabled || e.button !== 0) {
                        return;
                    }
                    props_onMouseDown();
                },
            );

            //For the forwarding, rest should be empty (typewise),
            // eslint-disable-next-line @typescript-eslint/ban-types
            doExtends<Any.Equals<typeof rest, {}>, 1>();

            const { classes, cx, css, theme } = useStyles({
                isSelected,
                isFirst,
                size,
                isDisabled,
                "arrowDirection":
                    props.type !== "arrow" ? undefined : props.direction,
                isVisible,
            });

            return (
                <div
                    ref={ref}
                    className={cx(classes.root, className)}
                    color="secondary"
                    onMouseDown={onMouseDown}
                    {...rest}
                >
                    {(() => {
                        switch (props.type) {
                            case "arrow":
                                return (
                                    <Icon
                                        iconId="chevronLeft"
                                        className={cx(
                                            (() => {
                                                switch (props.direction) {
                                                    case "right":
                                                        return css({
                                                            "transform":
                                                                "rotate(180deg)",
                                                        });
                                                    case "left":
                                                        return undefined;
                                                }
                                            })(),
                                            css({
                                                "color": isDisabled
                                                    ? theme.colors.useCases
                                                          .typography
                                                          .textDisabled
                                                    : undefined,
                                            }),
                                        )}
                                    />
                                );
                            case "tab":
                                return (
                                    <Text
                                        color={
                                            isDisabled ? "disabled" : undefined
                                        }
                                        typo={(() => {
                                            switch (size) {
                                                case "big":
                                                    return "label 1";
                                                case "small":
                                                    return "body 1";
                                            }
                                        })()}
                                        className={classes.typo}
                                    >
                                        {props.text}
                                    </Text>
                                );
                        }
                    })()}
                </div>
            );
        }),
    );

    return { Tab };
})();
