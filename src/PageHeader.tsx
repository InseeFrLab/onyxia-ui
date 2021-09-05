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

export type PageHeaderProps<IconId extends string> = {
    mainIcon?: IconId;
    title: string;
    helpIcon?: IconId | "sentimentSatisfied";
    helpTitle: NonNullable<React.ReactNode>;
    helpContent: NonNullable<React.ReactNode>;
    className?: string;
    /** Default true */
    isTitleVisible?: boolean;
    /** Default true */
    isHelpVisible?: boolean;
};

const useStyles = makeStyles<{
    helperHeight: number;
    titleWrapperHeight: number | undefined;
    helpWrapperHeight: number | undefined;
}>()((theme, { helperHeight, titleWrapperHeight, helpWrapperHeight }) => ({
    "root": {
        "backgroundColor": "inherit",
        "marginBottom":
            titleWrapperHeight !== 0 || helpWrapperHeight !== 0
                ? theme.spacing(3)
                : 0,
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
    "titleWrapper": {
        "height": titleWrapperHeight,
        "transition": "height 250ms",
        "overflow": "hidden",
    },
    "helpWrapper": {
        "marginTop": helpWrapperHeight !== 0 ? theme.spacing(3) : 0,
        "height": helpWrapperHeight,
        "transition": ["height", "margin"]
            .map(prop => `${prop} 250ms`)
            .join(", "),
        "overflow": "hidden",
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
            isTitleVisible = true,
            isHelpVisible = true,
        } = props;

        const {
            ref: titleRef,
            domRect: { height: titleHeight },
        } = useDomRect<HTMLElement>();
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

        const { classes, cx } = useStyles({
            helperHeight,
            "titleWrapperHeight":
                titleHeight === 0
                    ? undefined
                    : isTitleVisible
                    ? titleHeight
                    : 0,
            "helpWrapperHeight": isHelpClosed
                ? 0
                : helperHeight === 0
                ? undefined
                : isHelpVisible
                ? helperHeight
                : 0,
        });

        return (
            <div className={cx(classes.root, className)}>
                <div className={classes.titleWrapper}>
                    <Text
                        typo="page heading"
                        className={classes.title}
                        ref={titleRef}
                    >
                        {mainIcon && (
                            <Icon
                                iconId={mainIcon}
                                className={classes.titleIcon}
                                size="large"
                            />
                        )}
                        {title}
                    </Text>
                </div>
                <div className={classes.helpWrapper}>
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
                </div>
            </div>
        );
    });

    return { PageHeader };
}
