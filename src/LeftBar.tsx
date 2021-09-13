import { useMemo, useState, memo } from "react";
import type { FC } from "react";
import { makeStyles, useStyles as useTheme } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import Divider from "@material-ui/core/Divider";
import type { IconProps } from "./Icon";
import { id } from "tsafe/id";
import { objectKeys } from "tsafe/objectKeys";
import { createIcon } from "./Icon";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useDomRect } from "powerhooks/useDomRect";

export type Item<IconId extends string = string> = {
    iconId: IconId;
    label: string;
    /** Default false */
    hasDividerBelow?: boolean;
    link: {
        href: string;
        onClick?: (event: { preventDefault: () => void }) => void;
    };
};

export type LeftBarProps<IconId extends string, ItemId extends string> = {
    className?: string;
    collapsedWidth?: number;
    currentItemId?: ItemId;
    items: Record<ItemId, Item<IconId>>;
    /** Default reduce */
    reduceText?: string;
};

//TODO: The component cannot be scrolled
export function createLeftBar<IconId extends string>(params?: {
    Icon: (props: IconProps<IconId>) => ReturnType<FC>;
    persistIsPanelOpen: boolean;
}) {
    const { Icon, persistIsPanelOpen = false } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => {
            throw new Error("never");
        }),
    };

    const useStyles = makeStyles<{
        rootWidth: number;
        rootHeight: number;
        paddingTopBottomFactor: number;
        areTransitionEnabled: boolean;
    }>()(
        (
            theme,
            {
                rootWidth,
                rootHeight,
                paddingTopBottomFactor,
                areTransitionEnabled,
            },
        ) => ({
            "root": {
                "width": rootWidth,
                "height": rootHeight,
                ...theme.spacing.topBottom("padding", paddingTopBottomFactor),
                "backgroundColor": theme.colors.useCases.surfaces.surface1,
                "borderRadius": 16,
                "boxShadow": theme.shadows[3],
                "transition": areTransitionEnabled ? "width 250ms" : undefined,
                "position": "relative",
                "overflow": "hidden",
            },
            "wrapper": {
                "position": "absolute",
            },
            "button": {
                "marginTop": theme.spacing(2),
            },
        }),
    );

    const { useIsCollapsed } = createUseGlobalState("isCollapsed", false, {
        "persistance": persistIsPanelOpen ? "localStorage" : false,
    });

    const iconSize = "large";

    const LeftBar = memo(
        <ItemId extends string>(props: LeftBarProps<IconId, ItemId>) => {
            const { theme } = useTheme();

            const {
                className,
                collapsedWidth = 2 * theme.iconSizesInPxByName[iconSize],
                currentItemId,
                items,
                reduceText = "reduce",
            } = props;

            const { isCollapsed, setIsCollapsed } = useIsCollapsed();

            const toggleIsCollapsedLink = useMemo(
                () =>
                    id<Item["link"]>({
                        "href": "#",
                        "onClick": event => {
                            event.preventDefault();
                            setAreTransitionEnabled(true);
                            setIsCollapsed(isCollapsed => !isCollapsed);
                        },
                    }),
                [],
            );

            const {
                ref,
                domRect: { width: wrapperWidth, height: wrapperHeight },
            } = useDomRect();

            //We don't want animations to trigger on first render.
            const [areTransitionEnabled, setAreTransitionEnabled] =
                useState(false);

            const { classes, cx } = useStyles({
                "rootWidth": isCollapsed ? collapsedWidth : wrapperWidth,
                ...(() => {
                    const paddingTopBottomFactor = 3;
                    return {
                        paddingTopBottomFactor,
                        "rootHeight":
                            wrapperHeight +
                            theme.spacing(paddingTopBottomFactor) * 2,
                    };
                })(),
                areTransitionEnabled,
            });

            return (
                <nav className={cx(classes.root, className)}>
                    <div ref={ref} className={classes.wrapper}>
                        <CustomButton
                            key={"toggleIsCollapsed"}
                            isCollapsed={isCollapsed}
                            collapsedWidth={collapsedWidth}
                            isCurrent={undefined}
                            iconId="chevronLeft"
                            label={reduceText}
                            hasDividerBelow={undefined}
                            link={toggleIsCollapsedLink}
                        />
                        {objectKeys(items).map(itemId => (
                            <CustomButton
                                className={classes.button}
                                key={itemId}
                                isCollapsed={isCollapsed}
                                collapsedWidth={collapsedWidth}
                                isCurrent={itemId === currentItemId}
                                isButtonForTogglingIsCollapsed={false}
                                {...items[itemId]}
                            />
                        ))}
                    </div>
                </nav>
            );
        },
    );

    const { CustomButton } = (() => {
        type Props = {
            className?: string;
            isCollapsed: boolean;
            collapsedWidth: number;
            isCurrent: boolean | undefined;
        } & Item<IconId | "chevronLeft">;

        const useStyles = makeStyles<{
            collapsedWidth: number;
            isCollapsed: boolean;
            isCurrent: boolean | undefined;
            width: number;
        }>()(
            (theme, { collapsedWidth, isCollapsed, isCurrent, width }, css) => {
                const iconHoverBox = {
                    "display": "inline-block",
                    "position": "absolute",
                    "height": "100%",
                    ...(() => {
                        const offset = collapsedWidth / 8;

                        return {
                            "left": offset,
                            "right": isCollapsed ? offset : 0,
                        };
                    })(),
                    "zIndex": 1,
                    "borderRadius": `10px ${
                        isCollapsed ? "10px 10px" : "0 0"
                    } 10px`,
                } as const;

                const typoWrapper = {
                    "paddingRight": theme.spacing(2),
                    "flex": 1,
                    "borderRadius": "0 10px 10px 0",
                    "display": "flex",
                    "alignItems": "center",
                    "marginRight": theme.spacing(5),
                } as const;

                return {
                    "root": {
                        "color": theme.colors.useCases.typography.textPrimary,
                        "textDecoration": "none",
                        "display": "flex",
                        "cursor": "pointer",
                        [`&:hover .${css(iconHoverBox)}`]: {
                            "backgroundColor":
                                theme.colors.useCases.surfaces.background,
                        },
                        [`&:hover .${css(typoWrapper)}`]: {
                            "backgroundColor": !isCollapsed
                                ? theme.colors.useCases.surfaces.background
                                : undefined,
                        },
                        [[".MuiSvgIcon-root", "h6"]
                            .map(
                                name =>
                                    `&${isCurrent ? "" : ":active"} ${name}`,
                            )
                            .join(", ")]: {
                            "color": theme.colors.useCases.typography.textFocus,
                        },
                    },
                    "iconWrapper": {
                        "width": collapsedWidth,
                        "textAlign": "center",
                        "position": "relative",
                    },

                    "icon": {
                        "position": "relative",
                        "zIndex": 2,
                        ...theme.spacing.topBottom("margin", 2),
                        ...(isCurrent !== undefined
                            ? {}
                            : {
                                  "transform": isCollapsed
                                      ? "rotate(-180deg)"
                                      : "rotate(0)",
                              }),
                        "transition": `transform 250ms`,
                    },
                    iconHoverBox,
                    typoWrapper,
                    "divider": {
                        "marginTop": theme.spacing(2),
                        "borderColor":
                            theme.colors.useCases.typography.textTertiary,
                        "width":
                            (isCollapsed ? collapsedWidth : width) -
                            2 * theme.spacing(2),
                        "marginLeft": theme.spacing(2),
                        "transition": "width 250ms",
                    },
                };
            },
        );

        const { Icon: InternalIcon } = createIcon({
            "chevronLeft": ChevronLeftIcon,
        });

        const CustomButton = memo((props: Props) => {
            const {
                className,
                isCollapsed,
                collapsedWidth,
                isCurrent,
                iconId,
                label,
                link,
                hasDividerBelow = false,
            } = props;

            const { theme } = useTheme();

            const {
                ref,
                domRect: { width },
            } = useDomRect();

            const { classes, cx, css } = useStyles({
                "collapsedWidth":
                    collapsedWidth ?? 2 * theme.iconSizesInPxByName[iconSize],
                isCollapsed,
                isCurrent,
                width,
            });

            return (
                <>
                    <a
                        ref={ref}
                        className={cx(classes.root, className)}
                        {...link}
                    >
                        <div className={classes.iconWrapper}>
                            <div className={classes.iconHoverBox} />
                            {(() => {
                                const className = classes.icon;

                                return iconId === "chevronLeft" ? (
                                    <InternalIcon
                                        iconId="chevronLeft"
                                        className={className}
                                        size={iconSize}
                                    />
                                ) : (
                                    <Icon
                                        iconId={iconId}
                                        className={className}
                                        size={iconSize}
                                    />
                                );
                            })()}
                        </div>
                        <div className={classes.typoWrapper}>
                            <Text
                                typo="label 1"
                                className={css({ "whiteSpace": "nowrap" })}
                            >
                                {label}
                            </Text>
                        </div>
                    </a>
                    {hasDividerBelow && (
                        <Divider
                            className={classes.divider}
                            variant="fullWidth"
                        />
                    )}
                </>
            );
        });

        return { CustomButton };
    })();

    return { LeftBar };
}
