import { memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./lib/ThemeProvider";
import MuiLink from "@material-ui/core/Link";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { createIconButton } from "./IconButton";
import { createIcon } from "./Icon";

export type CollapsibleSectionHeaderProps = {
    className?: string;
    isCollapsed: boolean;
    onToggleIsCollapsed(): void;
    title: string;
    total: number;
    /** Default "Show all", provide your own string for internationalization. */
    showAllStr?: string;
};

const { IconButton } = createIconButton(
    createIcon({ "chevronLeft": ChevronLeftIcon }),
);

const useStyles = makeStyles<{ isCollapsed: boolean }>()(
    (...[, { isCollapsed }]) => ({
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
                      "visibility": "hidden",
                  }),
        },
        "link": {
            "cursor": "pointer",
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
                        onClick={onToggleIsCollapsed}
                        className={classes.link}
                    >
                        {showAllStr} ({total})
                    </MuiLink>
                )}
            </div>
        );
    },
);
