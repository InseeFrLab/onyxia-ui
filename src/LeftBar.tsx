import {
    useMemo,
    useState,
    forwardRef,
    memo,
    type ForwardedRef,
    type ReactNode,
} from "react";
import { tss, useStyles as useTheme } from "./lib/tss";
import { Text } from "./Text";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import Divider from "@mui/material/Divider";
import { id } from "tsafe/id";
import { objectKeys } from "tsafe/objectKeys";
import { useDomRect } from "powerhooks/useDomRect";
import { symToStr } from "tsafe/symToStr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { UseNamedStateReturnType } from "powerhooks/useNamedState";
import { Icon, type IconProps } from "./Icon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export type LeftBarProps<ItemId extends string> = {
    className?: string;
    defaultIsPanelOpen: boolean;
    doPersistIsPanelOpen: boolean;
    collapsedWidth?: number;
    currentItemId: ItemId | null;
    items: Record<ItemId, LeftBarProps.Item>;
    /** Default reduce */
    reduceText?: string;
};

export namespace LeftBarProps {
    export type Item = {
        icon: IconProps.Icon;
        label: NonNullable<ReactNode>;
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
}

let useIsCollapsed:
    | (() => UseNamedStateReturnType<boolean, "isCollapsed">)
    | undefined = undefined;

const iconSize = "large";

function NonMemoizedNonForwardedLeftBar<ItemId extends string>(
    props: LeftBarProps<ItemId>,
    ref: React.LegacyRef<HTMLDivElement>,
) {
    const { theme } = useTheme();

    const {
        className,
        defaultIsPanelOpen,
        doPersistIsPanelOpen,
        collapsedWidth = 2 * theme.iconSizesInPxByName[iconSize],
        currentItemId,
        items,
        reduceText = "reduce",
        ...rest
    } = props;

    if (useIsCollapsed === undefined) {
        useIsCollapsed = createUseGlobalState({
            "name": "isCollapsed",
            "initialState": !defaultIsPanelOpen,
            "doPersistAcrossReloads": doPersistIsPanelOpen,
        }).useIsCollapsed;
    }

    //For the forwarding, rest should be empty (typewise),
    // eslint-disable-next-line @typescript-eslint/ban-types
    assert<Equals<typeof rest, {}>>();

    const { isCollapsed, setIsCollapsed } = useIsCollapsed();

    const toggleIsCollapsedLink = useMemo(
        () =>
            id<LeftBarProps.Item["link"]>({
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
                    wrapperHeight + theme.spacing(paddingTopBottomFactor) * 2,
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
                        icon={ChevronLeftIcon}
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
export const LeftBar = memo(forwardRef(NonMemoizedNonForwardedLeftBar)) as
    <ItemId extends string>(props: LeftBarProps<ItemId> & { ref?: ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof NonMemoizedNonForwardedLeftBar>;

(LeftBar as any).displayName = symToStr({ LeftBar });

const useStyles = tss
    .withParams<{
        rootWidth: number;
        rootHeight: number;
        paddingTopBottomFactor: number;
        areTransitionEnabled: boolean;
    }>()
    .withName({ LeftBar })
    .create(
        ({
            theme,
            rootWidth,
            rootHeight,
            paddingTopBottomFactor,
            areTransitionEnabled,
        }) => ({
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
    } & LeftBarProps.Item;

    const CustomButton = memo((props: Props) => {
        const {
            className,
            isCollapsed,
            collapsedWidth,
            isCurrent,
            icon,
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
                <a ref={ref} className={cx(classes.root, className)} {...link}>
                    <div className={classes.iconWrapper}>
                        <div className={classes.iconHoverBox} />
                        <Icon
                            icon={icon}
                            className={classes.icon}
                            size={iconSize}
                        />
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

    const useStyles = tss
        .withParams<{
            collapsedWidth: number;
            isCollapsed: boolean;
            isCurrent: boolean | undefined;
            width: number;
            isDisabled: boolean;
        }>()
        .withNestedSelectors<"iconHoverBox" | "typoWrapper">()
        .withName(`${symToStr({ LeftBar })}${symToStr({ CustomButton })}`)
        .create(
            ({
                theme,
                collapsedWidth,
                isCollapsed,
                isCurrent,
                width,
                isDisabled,
                classes,
            }) => ({
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
