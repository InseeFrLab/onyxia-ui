import { useMemo, forwardRef, memo } from "react";
import type { FC } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { useDomRect } from "powerhooks/useDomRect";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { useConstCallback } from "powerhooks/useConstCallback";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import type { IconProps } from "./Icon";
import CloseSharp from "@mui/icons-material/CloseSharp";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { CollapsibleWrapper } from "./CollapsibleWrapper";
import type { CollapseParams } from "./CollapsibleWrapper";
import { useMergedClasses } from "tss-react/compat";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

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

    const PageHeader = memo(
        forwardRef<any, PageHeaderProps<IconId>>((props, ref) => {
            const {
                mainIcon,
                title,
                helpTitle,
                helpIcon,
                helpContent,
                className,
                titleCollapseParams: props_titleCollapseParams,
                helpCollapseParams: props_helpCollapseParams,
                classes: props_classes,
                children,
                //For the forwarding, rest should be empty (typewise)
                ...rest
            } = props;

            assert(!children);

            //For the forwarding, rest should be empty (typewise),
            // eslint-disable-next-line @typescript-eslint/ban-types
            assert<Equals<typeof rest, {}>>();

            const {
                ref: helperRef,
                domRect: { height: helperHeight },
            } = useDomRect<HTMLDivElement>();

            const { isHelpClosed, closeHelp } = (function useClosure() {
                const { pageHeaderClosedHelpers, setPageHeaderClosedHelpers } =
                    usePageHeaderClosedHelpers();

                const isHelpClosed = pageHeaderClosedHelpers.includes(title);

                const closeHelp = useConstCallback(() =>
                    setPageHeaderClosedHelpers([
                        ...pageHeaderClosedHelpers,
                        title,
                    ]),
                );

                return { isHelpClosed, closeHelp };
            })();

            let { classes, cx } = useStyles({
                helperHeight,
            });

            classes = useMergedClasses(classes, props_classes);

            const { titleCollapseParams } = useMemo(() => {
                let titleCollapseParams =
                    props_titleCollapseParams ??
                    id<CollapseParams>({
                        "behavior": "controlled",
                        "isCollapsed": false,
                    });

                titleCollapseParams.classes = {
                    ...titleCollapseParams.classes,
                    "bottomDivForSpacing": cx(
                        classes.titleBottomDivForSpacing,
                        titleCollapseParams.classes?.bottomDivForSpacing,
                    ),
                };

                return { titleCollapseParams };
            }, [
                props_titleCollapseParams,
                cx,
                classes.titleBottomDivForSpacing,
            ]);

            const { helpCollapseParams } = useMemo(() => {
                const helpCollapseParams = isHelpClosed
                    ? {
                          "behavior": "controlled" as const,
                          "isCollapsed": true,
                      }
                    : props_helpCollapseParams ?? {
                          "behavior": "controlled",
                          "isCollapsed": false,
                      };

                helpCollapseParams.classes = {
                    ...titleCollapseParams.classes,
                    "bottomDivForSpacing": cx(
                        classes.helpBottomDivForSpacing,
                        helpCollapseParams.classes?.bottomDivForSpacing,
                    ),
                };

                return { helpCollapseParams };
            }, [
                isHelpClosed,
                props_helpCollapseParams,
                cx,
                classes.helpBottomDivForSpacing,
            ]);

            return (
                <div
                    className={cx(classes.root, className)}
                    ref={ref}
                    {...rest}
                >
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
                    <CollapsibleWrapper {...helpCollapseParams}>
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
        }),
    );

    return { PageHeader };
}

const useStyles = makeStyles<{
    helperHeight: number;
}>({ "name": "PageHeader" })((theme, { helperHeight }) => ({
    "root": {
        "backgroundColor": "inherit",
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
    "titleBottomDivForSpacing": {
        "height": theme.spacing(4),
    },
    "helpBottomDivForSpacing": {
        "height": theme.spacing(3),
    },
}));
