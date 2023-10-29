import { useState, memo } from "react";
import { tss } from "./lib/tss";
import { Text } from "./Text";
import { useDomRect } from "powerhooks/useDomRect";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { useConstCallback } from "powerhooks/useConstCallback";
import { CollapsibleWrapper, type CollapseParams } from "./CollapsibleWrapper";
import type { MuiIconsComponentName } from "./MuiIconsComponentName";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

export type PageHeaderProps = {
    mainIcon?: string;
    title: string;
    helpIcon?: string;
    helpTitle: NonNullable<React.ReactNode>;
    helpContent: NonNullable<React.ReactNode>;
    className?: string;
    titleCollapseParams?: CollapseParams;
    helpCollapseParams?: CollapseParams;
    onCloseHelp?: () => void;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const { usePageHeaderClosedHelpers } = createUseGlobalState({
    "name": "pageHeaderClosedHelpers",
    "initialState": id<string[]>([]),
    "doPersistAcrossReloads": false,
});

export const PageHeader = memo((props: PageHeaderProps) => {
    const {
        mainIcon,
        title,
        helpTitle,
        helpIcon,
        helpContent,
        className,
        onCloseHelp,
    } = props;

    const { isTitleCollapsed, titleCollapseParams } = (function useClosure() {
        const [
            isTitleCollapsedIfDependsOnScroll,
            setIsTitleCollapsedIfDependsOnScroll,
        ] = useState(false);

        let isTitleCollapsed: boolean;

        let { titleCollapseParams } = props;

        switch (titleCollapseParams?.behavior) {
            case "controlled":
                isTitleCollapsed = titleCollapseParams.isCollapsed;
                break;
            case "collapses on scroll":
                {
                    const tmp = titleCollapseParams.onIsCollapsedValueChange;

                    titleCollapseParams.onIsCollapsedValueChange =
                        isCollapsed => {
                            setIsTitleCollapsedIfDependsOnScroll(isCollapsed);

                            tmp?.(isCollapsed);
                        };

                    isTitleCollapsed = isTitleCollapsedIfDependsOnScroll;
                }
                break;
            case undefined:
                {
                    const isCollapsed = false;
                    titleCollapseParams = id<CollapseParams>({
                        "behavior": "controlled",
                        isCollapsed,
                    });
                    isTitleCollapsed = isCollapsed;
                }
                break;
        }

        return { isTitleCollapsed, titleCollapseParams };
    })();

    const {
        ref: helperRef,
        domRect: { height: helperHeight },
    } = useDomRect<HTMLDivElement>();

    const { isHelpClosed, closeHelp } = (function useClosure() {
        const { pageHeaderClosedHelpers, setPageHeaderClosedHelpers } =
            usePageHeaderClosedHelpers();

        const isHelpClosed = pageHeaderClosedHelpers.includes(title);

        const closeHelp = useConstCallback(() => {
            onCloseHelp?.();
            setPageHeaderClosedHelpers([...pageHeaderClosedHelpers, title]);
        });

        return { isHelpClosed, closeHelp };
    })();

    const { isHelpCollapsed, helpCollapseParams } = (function useClosure() {
        const [
            isHelpCollapsedIfDependsOnScroll,
            setIsHelpCollapsedIfDependsOnScroll,
        ] = useState(false);

        let isHelpCollapsed: boolean;

        let { helpCollapseParams } = props;

        switch (helpCollapseParams?.behavior) {
            case "controlled":
                isHelpCollapsed = helpCollapseParams.isCollapsed;
                break;
            case "collapses on scroll":
                {
                    const tmp = helpCollapseParams.onIsCollapsedValueChange;

                    helpCollapseParams.onIsCollapsedValueChange =
                        isCollapsed => {
                            setIsHelpCollapsedIfDependsOnScroll(isCollapsed);

                            tmp?.(isCollapsed);
                        };

                    isHelpCollapsed = isHelpCollapsedIfDependsOnScroll;
                }
                break;
            case undefined:
                {
                    const isCollapsed = false;
                    helpCollapseParams = id<CollapseParams>({
                        "behavior": "controlled",
                        isCollapsed,
                    });
                    isHelpCollapsed = isCollapsed;
                }
                break;
        }

        return {
            isHelpCollapsed,
            "helpCollapseParams": isHelpClosed
                ? {
                      "behavior": "controlled" as const,
                      "isCollapsed": true,
                  }
                : helpCollapseParams,
        };
    })();

    const { classes, cx } = useStyles({
        helperHeight,
        isTitleCollapsed,
        "isHelpCollapsed": isHelpCollapsed || isHelpClosed,
        "classesOverrides": props.classes,
    });

    return (
        <div className={cx(classes.root, className)}>
            <CollapsibleWrapper {...titleCollapseParams}>
                <Text typo="page heading" className={classes.title}>
                    {mainIcon && (
                        <Icon
                            iconId={mainIcon}
                            className={classes.titleIcon}
                            size="large"
                        />
                    )}
                    {title}
                </Text>
            </CollapsibleWrapper>
            <CollapsibleWrapper
                className={classes.helpCollapsibleWrapper}
                {...helpCollapseParams}
            >
                <div ref={helperRef} className={classes.help}>
                    {helpIcon !== undefined && (
                        <div>
                            <Icon
                                iconId={helpIcon}
                                className={classes.helpIcon}
                            />
                        </div>
                    )}
                    <div className={classes.helpMiddle}>
                        <Text typo="navigation label">{helpTitle}</Text>
                        <Text typo="body 1">{helpContent}</Text>
                    </div>
                    <div>
                        <IconButton
                            iconId={id<MuiIconsComponentName>("Close")}
                            onClick={closeHelp}
                            className={classes.closeButton}
                        />
                    </div>
                </div>
            </CollapsibleWrapper>
        </div>
    );
});

const useStyles = tss
    .withName({ PageHeader })
    .withParams<{
        helperHeight: number;
        isTitleCollapsed: boolean;
        isHelpCollapsed: boolean;
    }>()
    .create(({ theme, helperHeight, isTitleCollapsed, isHelpCollapsed }) => ({
        "root": {
            "backgroundColor": "inherit",
            "marginBottom":
                !isTitleCollapsed || !isHelpCollapsed ? theme.spacing(3) : 0,
        },
        "title": {
            "display": "flex",
            "alignItems": "center",
        },
        "titleIcon": {
            "marginRight": theme.spacing(3),
        },
        "help": {
            "display": "flex",
            "backgroundColor": theme.colors.useCases.surfaces.surface2,
            "alignItems": "start",
            "padding": theme.spacing(3),
            "borderRadius": helperHeight * 0.15,
        },
        "helpMiddle": {
            "flex": 1,
        },
        "helpIcon": {
            "marginRight": theme.spacing(3),
            "color": theme.colors.useCases.typography.textFocus,
        },
        "closeButton": {
            "padding": 0,
            "marginLeft": theme.spacing(3),
        },
        "helpCollapsibleWrapper": {
            "marginTop": isHelpCollapsed ? 0 : theme.spacing(3),
        },
    }));
