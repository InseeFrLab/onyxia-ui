import { memo } from "react";
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
import CloseSharp from "@material-ui/icons/CloseSharp";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import { CollapsibleWrapper } from "./tools/CollapsibleWrapper";

export type PageHeaderProps<IconId extends string> = {
    mainIcon?: IconId;
    title: string;
    helpIcon?: IconId | "sentimentSatisfied";
    helpTitle: NonNullable<React.ReactNode>;
    helpContent: NonNullable<React.ReactNode>;
    className?: string;
    /** Default false */
    isTitleCollapsed?: boolean;
    /** Default false */
    isHelpCollapsed?: boolean;
};

const useStyles = makeStyles<{
    helperHeight: number;
    isTitleCollapsed: boolean;
    isHelpCollapsed: boolean;
}>()((theme, { helperHeight, isTitleCollapsed, isHelpCollapsed }) => ({
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
        const {
            mainIcon,
            title,
            helpTitle,
            helpIcon,
            helpContent,
            className,
            isTitleCollapsed = false,
        } = props;

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

        const isHelpCollapsed =
            isHelpClosed || (props.isHelpCollapsed ?? false);

        const { classes, cx } = useStyles({
            helperHeight,
            isTitleCollapsed,
            isHelpCollapsed,
        });

        return (
            <div className={cx(classes.root, className)}>
                <CollapsibleWrapper isCollapsed={isTitleCollapsed}>
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
                    isCollapsed={isHelpCollapsed}
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
