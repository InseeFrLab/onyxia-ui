import { memo } from "react";
import type { ReactNode } from "react";
import { tss } from "./lib/tss";
import { Text } from "./Text";

export type TagProps = {
    className?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    text: NonNullable<ReactNode>;
    onClick?: () => void;
};

export const Tag = memo((props: TagProps) => {
    const { text, className, onClick } = props;

    const { classes, cx } = useStyles({
        "classesOverrides": props.classes,
    });

    return (
        <div className={cx(classes.root, className)} onClick={onClick}>
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

const useStyles = tss.withName({ Tag }).create(({ theme }) => ({
    "root": {
        "backgroundColor":
            theme.colors.palette[theme.isDarkModeEnabled ? "light" : "dark"]
                .main,
        "padding": theme.spacing({ "topBottom": 1, "rightLeft": 2 }),
        "borderRadius": theme.spacing(3),
        "display": "inline-block",
        "cursor": "pointer",
    },
    "text": {
        "color":
            theme.colors.palette[theme.isDarkModeEnabled ? "dark" : "light"]
                .main,
    },
}));
