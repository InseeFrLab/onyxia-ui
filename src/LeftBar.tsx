import {
    useMemo,
    useState,
    forwardRef,
    memo,
    type FC,
    type ForwardedRef,
} from "react";
import { makeStyles, useStyles as useTheme } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import Divider from "@mui/material/Divider";
import type { IconProps } from "./Icon";
import { id } from "tsafe/id";
import { objectKeys } from "tsafe/objectKeys";
import { createIcon } from "./Icon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useDomRect } from "powerhooks/useDomRect";
import { symToStr } from "tsafe/symToStr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

export type Item<IconId extends string = string> = {
    iconId: IconId;
    label: string;
    /** Defaults to available */
    availability?: "available" | "greyed" | "not visible";
    /** Default: false (no divider). A string can be provided, is will be used as "about" for a11y  */
    belowDivider?: string | boolean;
    link: {
        href: string;
        onClick?: (event: { preventDefault: () => void }) => void;
        target?: "_blank";
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
    defaultIsPanelOpen: boolean;
}) {
    const {
        Icon,
        persistIsPanelOpen = false,
        defaultIsPanelOpen = true,
    } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => {
            throw new Error("never");
        }),
    };

    const { useIsCollapsed } = createUseGlobalState({
        "name": "isCollapsed",
        "initialState": !defaultIsPanelOpen,
        "doPersistAcrossReloads": persistIsPanelOpen,
    });

    const iconSize = "large";

    function NonMemoizedNonForwardedLeftBar<ItemId extends string>(
        props: LeftBarProps<IconId, ItemId>,
        ref: React.LegacyRef<HTMLDivElement>,
    ) {
        const { theme } = useTheme();

        const {
            className,
            collapsedWidth = 2 * theme.iconSizesInPxByName[iconSize],
            currentItemId,
            items,
            reduceText = "reduce",
            ...rest
        } = props;

        //For the forwarding, rest should be empty (typewise),
        // eslint-disable-next-line @typescript-eslint/ban-types
        assert<Equals<typeof rest, {}>>();

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
            ref: wrapperRef,
            domRect: { width: wrapperWidth, height: wrapperHeight },
        } = useDomRect();

        //We don't want animations to trigger on first render.
        const [areTransitionEnabled, setAreTransitionEnabled] = useState(false);

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
            <div ref={ref} {...rest} className={cx(classes.root, className)}>
                <nav className={classes.nav}>
                    <div ref={wrapperRef} className={classes.wrapper}>
                        <CustomButton
                            key={"toggleIsCollapsed"}
                            isCollapsed={isCollapsed}
                            collapsedWidth={collapsedWidth}
                            isCurrent={undefined}
                            iconId="chevronLeft"
                            label={reduceText}
                            link={toggleIsCollapsedLink}
                        />
                        {objectKeys(items).map(itemId => (
                            <CustomButton
                                className={classes.button}
                                key={itemId}
                                isCollapsed={isCollapsed}
                                collapsedWidth={collapsedWidth}
                                isCurrent={itemId === currentItemId}
                                {...items[itemId]}
                            />
                        ))}
                    </div>
                </nav>
            </div>
        );
    }

    /* prettier-ignore */
    const LeftBar = memo(forwardRef(NonMemoizedNonForwardedLeftBar)) as 
        <ItemId extends string>(props: LeftBarProps<IconId, ItemId> & { ref?: ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof NonMemoizedNonForwardedLeftBar>;

    (LeftBar as any).displayName = symToStr({ LeftBar });

    const useStyles = makeStyles<{
        rootWidth: number;
        rootHeight: number;
        paddingTopBottomFactor: number;
        areTransitionEnabled: boolean;
    }>({ "name": { LeftBar } })(
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
                "borderRadius": 16,
                "boxShadow": theme.shadows[3],
                "overflow": "auto",
                "backgroundColor": theme.colors.useCases.surfaces.surface1,
            },
            "nav": {
                "width": rootWidth,
                "height": rootHeight,
                ...theme.spacing.topBottom("padding", paddingTopBottomFactor),
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

    const { CustomButton } = (() => {
        type Props = {
            className?: string;
            isCollapsed: boolean;
            collapsedWidth: number;
            isCurrent: boolean | undefined;
        } & Item<IconId | "chevronLeft">;

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
                belowDivider = false,
                availability = "available",
            } = props;

            const { theme } = useTheme();

            const {
                ref,
                domRect: { width },
            } = useDomRect();

            const { classes, cx } = useStyles({
                "collapsedWidth":
                    collapsedWidth ?? 2 * theme.iconSizesInPxByName[iconSize],
                isCollapsed,
                isCurrent,
                width,
                "isDisabled": availability === "greyed",
            });

            if (availability === "not visible") {
                return null;
            }

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
                            <Text typo="label 1" className={classes.typo}>
                                {label}
                            </Text>
                        </div>
                    </a>
                    {belowDivider !== false && (
                        <Divider
                            className={classes.divider}
                            variant="fullWidth"
                            about={
                                typeof belowDivider !== "string"
                                    ? undefined
                                    : belowDivider
                            }
                        />
                    )}
                </>
            );
        });

        const useStyles = makeStyles<
            {
                collapsedWidth: number;
                isCollapsed: boolean;
                isCurrent: boolean | undefined;
                width: number;
                isDisabled: boolean;
            },
            "iconHoverBox" | "typoWrapper"
        >({
            "name": `${symToStr({ LeftBar })}${symToStr({ CustomButton })}`,
        })(
            (
                theme,
                { collapsedWidth, isCollapsed, isCurrent, width, isDisabled },
                classes,
            ) => ({
                "root": {
                    ...(isDisabled ? { "pointerEvents": "none" } : {}),
                    "color": theme.colors.useCases.typography.textPrimary,
                    "textDecoration": "none",
                    "display": "flex",
                    "cursor": "pointer",
                    [`&:hover .${classes.iconHoverBox}`]: {
                        "backgroundColor":
                            theme.colors.useCases.surfaces.background,
                    },
                    [`&:hover .${classes.typoWrapper}`]: {
                        "backgroundColor": !isCollapsed
                            ? theme.colors.useCases.surfaces.background
                            : undefined,
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
                    "color": isDisabled
                        ? theme.colors.useCases.typography.textDisabled
                        : undefined,
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
                "iconHoverBox": {
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
                },

                "typoWrapper": {
                    "paddingRight": theme.spacing(2),
                    "flex": 1,
                    "borderRadius": "0 10px 10px 0",
                    "display": "flex",
                    "alignItems": "center",
                    "marginRight": theme.spacing(5),
                },

                "typo": {
                    "color": isDisabled
                        ? theme.colors.useCases.typography.textDisabled
                        : undefined,
                    "whiteSpace": "nowrap",
                    "marginRight": theme.spacing(2),
                },
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
            }),
        );

        return { CustomButton };
    })();

    return { LeftBar };
}
