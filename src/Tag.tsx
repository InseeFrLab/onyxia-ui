import { memo } from "react";
import type { ReactNode } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";

export type TagProps = {
    className?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    text: NonNullable<ReactNode>;
};

export const Tag = memo((props: TagProps) => {
    const { text, className } = props;

    const { classes, cx } = useStyles(undefined, { props });

    return (
        <div className={cx(classes.root, className)}>
            {typeof text === "string" ? (
                <Text className={classes.text} typo="body 3">
                    {text}
                </Text>
            ) : (
                text
            )}
        </div>
    );
});

const useStyles = makeStyles({
    "name": { Tag },
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
