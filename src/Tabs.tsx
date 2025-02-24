import { Text } from "./Text";
import { tss } from "./lib/tss";
import { useState, useMemo, memo, forwardRef } from "react";
import type { ReactNode } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useDomRect } from "powerhooks";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useEvt } from "evt/hooks";
import { useStateRef } from "powerhooks/useStateRef";
import { Evt } from "evt";
import { Icon } from "./Icon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export type TabProps<TabId extends string = string> = {
    className?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
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
    } = useDomRect();
    const {
        ref: leftArrowRef,
        domRect: { width: leftArrowWidth, height: leftArrowHeight },
    } = useDomRect();

    const tabWidth = useMemo(
        () =>
            tabs.length > maxTabCount
                ? (rootWidth - 2 * leftArrowWidth) / maxTabCount
                : rootWidth / tabs.length,
        [rootWidth, leftArrowWidth, maxTabCount, tabs.length],
    );

    const tabsWrapperWidth = useMemo(
        () => tabWidth * tabs.length,
        [tabWidth, tabs.length],
    );

    const areArrowsVisible = tabs.length > maxTabCount;

    const { classes, cx, css } = useStyles({
        tabsWrapperWidth,
        leftArrowWidth: areArrowsVisible ? leftArrowWidth : 0,
        leftArrowHeight,
        offset,
        tabWidth,
        classesOverrides: props.classes,
    });

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

    const onTabClickFactory = useCallbackFactory(([id]: [TabId]) =>
        onRequestChangeActiveTab(id),
    );

    const isLeftArrowDisabled = firstTabIndex === 0;
    const isRightArrowDisabled = tabs.length - firstTabIndex === maxTabCount;

    const tabWrapperRef = useStateRef<HTMLDivElement>(null);

    useEvt(
        ctx => {
            const element = tabWrapperRef.current;

            if (element === null) {
                return;
            }

            if (tabs.length <= maxTabCount) {
                return;
            }

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
            });

            Evt.from(ctx, element, "wheel").attach(wheelEvent => {
                wheelEvent.preventDefault();

                const direction: "left" | "right" | undefined = (() => {
                    // Determine the direction of the scroll
                    const horizontalDirection =
                        wheelEvent.deltaX < 0 ? "left" : "right";
                    const verticalDirection =
                        wheelEvent.deltaY < 0 ? "up" : "down";

                    // Prioritize horizontal scrolling when both deltaX and deltaY are present
                    if (wheelEvent.deltaX !== 0) {
                        return horizontalDirection;
                    } else if (wheelEvent.deltaY !== 0) {
                        switch (verticalDirection) {
                            case "up":
                                return "left";
                            case "down":
                                return "right";
                        }
                    }
                    return undefined;
                })();

                if (direction === undefined) {
                    return;
                }

                // Execute actions based on the determined direction
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
            });
        },
        [tabWrapperRef.current, firstTabIndex, offset],
    );

    //NOTE: We create an invisible to be sure we get the correct arrow height.
    const renderLeftArrow = (
        leftArrowRef?: React.RefObject<any>,
        className?: string,
    ) => (
        <CustomButton
            ref={leftArrowRef}
            type="arrow"
            direction="left"
            size={size}
            isFirst={false}
            className={cx(classes.leftArrow, className)}
            isDisabled={isLeftArrowDisabled}
            isSelected={false}
            onClick={onArrowClickFactory("left")}
            isVisible={true}
        />
    );

    return (
        <>
            <div className={cx(classes.root, className)} ref={rootRef}>
                <div className={classes.top}>
                    {areArrowsVisible && renderLeftArrow()}
                    <div ref={tabWrapperRef} className={classes.tabsWrapper}>
                        {tabs
                            .map(({ id, ...rest }) => ({
                                id,
                                isSelected: id === activeTabId,
                                ...rest,
                            }))
                            .map(({ id, title, isSelected }, i) => (
                                <CustomButton
                                    type="tab"
                                    text={title}
                                    size={size}
                                    isDisabled={false}
                                    isFirst={i === 0}
                                    className={cx(
                                        classes.tab,
                                        css({
                                            zIndex: isSelected
                                                ? maxTabCount + 1
                                                : maxTabCount - i,
                                        }),
                                    )}
                                    key={id}
                                    onClick={onTabClickFactory(id)}
                                    isSelected={isSelected}
                                    isVisible={
                                        i >= firstTabIndex &&
                                        i < firstTabIndex + maxTabCount
                                    }
                                />
                            ))}
                    </div>
                    {areArrowsVisible && (
                        <CustomButton
                            type="arrow"
                            direction="right"
                            size={size}
                            isFirst={false}
                            className={classes.rightArrow}
                            isDisabled={isRightArrowDisabled}
                            isSelected={false}
                            onClick={onArrowClickFactory("right")}
                            isVisible={true}
                        />
                    )}
                </div>

                <div className={classes.content}>{children}</div>
            </div>
            {renderLeftArrow(
                leftArrowRef,
                css({ position: "fixed", visibility: "hidden" }),
            )}
        </>
    );
}

const { CustomButton } = (() => {
    type CustomButtonProps = {
        size: "big" | "small";
        className?: string;
        isDisabled: boolean;
        isSelected: boolean;
        isFirst: boolean;
        isVisible: boolean;
        onClick(): void;
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

    const useStyles = tss
        .withParams<
            Pick<
                CustomButtonProps,
                "isSelected" | "isFirst" | "size" | "isDisabled" | "isVisible"
            > & {
                arrowDirection: undefined | "left" | "right";
            }
        >()
        .create(
            ({
                theme,
                isSelected,
                isFirst,
                size,
                isDisabled,
                arrowDirection,
                isVisible,
            }) => ({
                root: {
                    backgroundColor:
                        theme.colors.useCases.surfaces[
                            isSelected ? "surface1" : "surface2"
                        ],
                    boxShadow:
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
                    padding: theme.spacing(
                        (() => {
                            switch (size) {
                                case "big":
                                    return { topBottom: 3, rightLeft: 4 };
                                case "small":
                                    return { topBottom: 2, rightLeft: 3 };
                            }
                        })(),
                    ),
                    display: "flex",
                    alignItems: "center",
                    cursor: !isDisabled ? "pointer" : "default",
                },
                typo: {
                    fontWeight: isSelected ? 600 : undefined,
                },
            }),
        );

    const CustomButton = memo(
        forwardRef<any, CustomButtonProps>((props, ref) => {
            const {
                onClick,
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
                switch (restTmp.type) {
                    case "arrow": {
                        const { type, direction, ...out } = restTmp;
                        return out;
                    }
                    case "tab": {
                        const { type, text, ...out } = restTmp;
                        return out;
                    }
                }
            })();

            const onMouseDown = useConstCallback(
                (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    e.preventDefault();
                    if (isDisabled || e.button !== 0) {
                        return;
                    }
                    onClick();
                },
            );

            //For the forwarding, rest should be empty (typewise),
            assert<Equals<typeof rest, {}>>();

            const { classes, cx, css, theme } = useStyles({
                isSelected,
                isFirst,
                size,
                isDisabled,
                arrowDirection:
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
                                        icon={ChevronLeftIcon}
                                        className={cx(
                                            (() => {
                                                switch (props.direction) {
                                                    case "right":
                                                        return css({
                                                            transform:
                                                                "rotate(180deg)",
                                                        });
                                                    case "left":
                                                        return undefined;
                                                }
                                            })(),
                                            css({
                                                color: isDisabled
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

    return { CustomButton };
})();

const useStyles = tss
    .withParams<{
        tabsWrapperWidth: number;
        leftArrowWidth: number;
        leftArrowHeight: number;
        offset: number;
        tabWidth: number;
    }>()
    .withName({ Tabs })
    .create(
        ({
            theme,
            tabsWrapperWidth,
            leftArrowWidth,
            leftArrowHeight,
            offset,
            tabWidth,
        }) => {
            const arrows = {
                top: 0,
                zIndex: 1,
                position: "absolute",
            } as const;

            return {
                root: {
                    backgroundColor: theme.colors.useCases.surfaces.surface1,
                    visibility: tabWidth === 0 ? "hidden" : "visible",
                },
                top: {
                    overflow: "hidden",
                    position: "relative",
                },
                leftArrow: {
                    ...arrows,
                    left: 0,
                },
                rightArrow: {
                    ...arrows,
                    right: 0,
                },
                tabsWrapper: {
                    transition: "left 250ms",
                    transitionTimingFunction: "ease",
                    position: "relative",
                    left: offset * tabWidth,
                    transform: `translateX(${leftArrowWidth}px)`,
                    zIndex: 0,
                    width: tabsWrapperWidth,
                    display: "flex",
                },
                tab: {
                    flex: 1,
                    height: leftArrowHeight || undefined,
                },
                content: {
                    padding: theme.spacing(4),
                },
            };
        },
    );
