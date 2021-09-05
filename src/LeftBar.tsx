import { useMemo, memo } from "react";
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

export function createLeftBar<IconId extends string>(params?: {
    Icon: (props: IconProps<IconId>) => ReturnType<FC>;
    persistIsPanelOpen: boolean;
}) {
    const { Icon, persistIsPanelOpen = false } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => {
            throw new Error("never");
        }),
    };

    const useStyles = makeStyles()(theme => ({
        "root": {
            "overflow": "visible",
        },
        "nav": {
            ...theme.spacing.topBottom("padding", 3),
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "borderRadius": 16,
            "boxShadow": theme.shadows[3],
            "overflow": "auto",
            "height": "100%",
        },
        "button": {
            "marginTop": theme.spacing(2),
        },
    }));

    const { useIsCollapsed } = createUseGlobalState("isCollapsed", false, {
        "persistance": persistIsPanelOpen ? "localStorage" : false,
    });

    const LeftBar = memo(
        <ItemId extends string>(props: LeftBarProps<IconId, ItemId>) => {
            const {
                className,
                collapsedWidth,
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
                            setIsCollapsed(isCollapsed => !isCollapsed);
                        },
                    }),
                [],
            );

            const { classes, cx } = useStyles();

            return (
                <section className={cx(classes.root, className)}>
                    <nav className={classes.nav}>
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
                    </nav>
                </section>
            );
        },
    );

    const { CustomButton } = (() => {
        type Props = {
            className?: string;
            isCollapsed: boolean;
            collapsedWidth: number | undefined;
            isCurrent: boolean | undefined;
        } & Item<IconId | "chevronLeft">;

        const useStyles = makeStyles<{
            collapsedWidth: number;
            isCollapsed: boolean;
            isCurrent: boolean | undefined;
        }>()((theme, { collapsedWidth, isCollapsed, isCurrent }, css) => {
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
                    [[iconHoverBox, typoWrapper]
                        .map(cssObject => `&:hover .${css(cssObject)}`)
                        .join(", ")]: {
                        "backgroundColor":
                            theme.colors.useCases.surfaces.background,
                    },
                    [[".MuiSvgIcon-root", "h6"]
                        .map(name => `&${isCurrent ? "" : ":active"} ${name}`)
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
                },
            };
        });

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

            const iconSize = "large";

            const { theme } = useTheme();

            const { classes, cx } = useStyles({
                "collapsedWidth":
                    collapsedWidth ?? 2 * theme.iconSizesInPxByName[iconSize],
                isCollapsed,
                isCurrent,
            });

            return (
                <>
                    <a className={cx(classes.root, className)} {...link}>
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
                        {!isCollapsed && (
                            <div className={classes.typoWrapper}>
                                <Text typo="label 1">{label}</Text>
                            </div>
                        )}
                    </a>
                    {hasDividerBelow && (
                        <Divider className={classes.divider} variant="middle" />
                    )}
                </>
            );
        });

        return { CustomButton };
    })();

    return { LeftBar };
}
