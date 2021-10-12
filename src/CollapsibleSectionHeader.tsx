import { memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import MuiLink from "@mui/material/Link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { createIconButton } from "./IconButton";
import { createIcon } from "./Icon";
import { pxToNumber } from "./tools/pxToNumber";

export type CollapsibleSectionHeaderProps = {
    className?: string;
    isCollapsed: boolean;
    onToggleIsCollapsed(): void;
    title: string;
    total?: number;
    /** Default "Show all", provide your own string for internationalization. */
    showAllStr?: string;
};

const { IconButton } = createIconButton(
    createIcon({ "chevronLeft": ChevronLeftIcon }),
);

const useStyles = makeStyles<{ isCollapsed: boolean }>()(
    (...[theme, { isCollapsed }]) => ({
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
    }),
);

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
                    iconId="chevronLeft"
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
