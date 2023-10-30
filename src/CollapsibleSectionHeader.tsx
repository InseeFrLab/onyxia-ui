import { memo } from "react";
import { tss } from "./lib/tss";
import { Text } from "./Text";
import MuiLink from "@mui/material/Link";
import { pxToNumber } from "./tools/pxToNumber";
import { IconButton } from "./IconButton";
import { symToStr } from "tsafe/symToStr";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export type CollapsibleSectionHeaderProps = {
    className?: string;
    isCollapsed: boolean;
    onToggleIsCollapsed(): void;
    title: string;
    total?: number;
    /** Default "Show all", provide your own string for internationalization. */
    showAllStr?: string;
};

export const CollapsibleSectionHeader = memo(
    (props: CollapsibleSectionHeaderProps) => {
        const {
            className,
            title,
            isCollapsed,
            onToggleIsCollapsed,
            total,
            showAllStr = "Show all",
        } = props;

        const { classes, cx } = useStyles({ isCollapsed });

        return (
            <div className={cx(classes.root, className)}>
                <IconButton
                    className={classes.chevron}
                    size="large"
                    icon={ChevronLeftIcon}
                    onClick={onToggleIsCollapsed}
                />
                <Text typo="section heading"> {title} </Text>
                <div style={{ "flex": "1" }} />
                {isCollapsed && (
                    <MuiLink
                        underline="hover"
                        onClick={onToggleIsCollapsed}
                        className={classes.link}
                    >
                        {showAllStr}
                        {total !== undefined && <span>&nbsp;({total})</span>}
                    </MuiLink>
                )}
            </div>
        );
    },
);

CollapsibleSectionHeader.displayName = symToStr({ CollapsibleSectionHeader });

const useStyles = tss
    .withName({ CollapsibleSectionHeader })
    .withParams<{ isCollapsed: boolean }>()
    .create(({ theme, isCollapsed }) => ({
        "root": {
            "display": "flex",
            "alignItems": "center",
        },
        "chevron": {
            "paddingLeft": 0,
            ...(!isCollapsed
                ? {}
                : {
                      "width": 0,
                      "paddingLeft": 0,
                      "paddingRight": 0,
                      "visibility": "hidden",
                  }),
        },
        "link": {
            "cursor": "pointer",
            //Ugly solution to vertically align with text
            "paddingTop":
                0.183 *
                pxToNumber(
                    theme.typography.variants["section heading"].style
                        .lineHeight,
                ),
        },
    }));
