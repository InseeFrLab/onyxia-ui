import { memo } from "react";
import type { ReactNode } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";

export type TagProps = {
    className?: string;
    text: NonNullable<ReactNode>;
};

export const Tag = memo((props: TagProps) => {
    const { text, className } = props;

    const { classes, cx } = useStyles();

    return (
        <div className={cx(classes.root, className)}>
            <Text className={classes.text} typo="body 3">
                {text}
            </Text>
        </div>
    );
});

const useStyles = makeStyles({
    "label": { Tag },
})(theme => ({
    "root": {
        "backgroundColor":
            theme.colors.palette[theme.isDarkModeEnabled ? "light" : "dark"]
                .main,
        "padding": theme.spacing({ "topBottom": 1, "rightLeft": 2 }),
        "borderRadius": theme.spacing(3),
        "display": "inline-block",
    },
    "text": {
        "color":
            theme.colors.palette[theme.isDarkModeEnabled ? "dark" : "light"]
                .main,
    },
}));
