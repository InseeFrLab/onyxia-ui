import { useState, memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { useDomRect } from "powerhooks/useDomRect";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { useConstCallback } from "powerhooks/useConstCallback";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import type { IconProps } from "./Icon";
import type { FC } from "react";
import CloseSharp from "@mui/icons-material/CloseSharp";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { CollapsibleWrapper } from "./tools/CollapsibleWrapper";
import type { CollapseParams } from "./tools/CollapsibleWrapper";
import { useMergedClasses } from "tss-react/compat";

export type PageHeaderProps<IconId extends string> = {
    mainIcon?: IconId;
    title: string;
    helpIcon?: IconId | "sentimentSatisfied";
    helpTitle: NonNullable<React.ReactNode>;
    helpContent: NonNullable<React.ReactNode>;
    className?: string;
    titleCollapseParams?: CollapseParams;
    helpCollapseParams?: CollapseParams;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const { usePageHeaderClosedHelpers } = createUseGlobalState(
    "pageHeaderClosedHelpers",
    id<string[]>([]),
    { "persistance": false },
);

const { Icon: LocalIcon } = createIcon({
    "close": CloseSharp,
    "sentimentSatisfied": SentimentSatisfiedIcon,
});

const { IconButton } = createIconButton({ "Icon": LocalIcon });

export function createPageHeader<IconId extends string>(params?: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params ?? {
        "Icon": id<(props: IconProps<IconId>) => JSX.Element>(() => {
            throw new Error("never");
        }),
    };

    const PageHeader = memo((props: PageHeaderProps<IconId>) => {
        const { mainIcon, title, helpTitle, helpIcon, helpContent, className } =
            props;

        const { isTitleCollapsed, titleCollapseParams } =
            (function useClosure() {
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
                            const tmp =
                                titleCollapseParams.onIsCollapsedValueChange;

                            titleCollapseParams.onIsCollapsedValueChange =
                                isCollapsed => {
                                    setIsTitleCollapsedIfDependsOnScroll(
                                        isCollapsed,
                                    );

                                    tmp?.(isCollapsed);
                                };

                            isTitleCollapsed =
                                isTitleCollapsedIfDependsOnScroll;
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

            const closeHelp = useConstCallback(() =>
                setPageHeaderClosedHelpers([...pageHeaderClosedHelpers, title]),
            );

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
                                setIsHelpCollapsedIfDependsOnScroll(
                                    isCollapsed,
                                );

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

        let { classes, cx } = useStyles({
            helperHeight,
            isTitleCollapsed,
            "isHelpCollapsed": isHelpCollapsed || isHelpClosed,
        });

        classes = useMergedClasses(classes, props.classes);

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
                        {helpIcon && (
                            <div>
                                {helpIcon === "sentimentSatisfied" ? (
                                    <LocalIcon
                                        iconId="sentimentSatisfied"
                                        className={classes.helpIcon}
                                    />
                                ) : (
                                    <Icon
                                        iconId={helpIcon}
                                        className={classes.helpIcon}
                                    />
                                )}
                            </div>
                        )}
                        <div className={classes.helpMiddle}>
                            <Text typo="navigation label">{helpTitle}</Text>
                            <Text typo="body 1">{helpContent}</Text>
                        </div>
                        <div>
                            <IconButton
                                iconId="close"
                                onClick={closeHelp}
                                className={classes.closeButton}
                            />
                        </div>
                    </div>
                </CollapsibleWrapper>
            </div>
        );
    });

    return { PageHeader };
}

const useStyles = makeStyles<{
    helperHeight: number;
    isTitleCollapsed: boolean;
    isHelpCollapsed: boolean;
}>({ "name": "PageHeader" })(
    (theme, { helperHeight, isTitleCollapsed, isHelpCollapsed }) => ({
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
    }),
);
