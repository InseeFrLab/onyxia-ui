import type { ExtraProps } from "react-markdown";
import { tss } from "../lib/tss";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import {
    coldarkDark,
    coldarkCold,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { assert } from "tsafe/assert";

export default function Code(
    props: React.ClassAttributes<HTMLElement> &
        React.HTMLAttributes<HTMLElement> &
        ExtraProps,
) {
    const { children, className, node, ...rest } = props;

    assert(typeof children === "string");

    const language = (() => {
        const match = /language-(\w+)/.exec(className || "");

        return match === null ? undefined : match[1];
    })();

    const isInline = !children.includes("\n") && language === undefined;

    const { theme, classes, cx } = useStyles({ isInline });

    return (
        //@ts-expect-error: As documented
        <SyntaxHighlighter
            {...rest}
            className={cx(classes.root, className)}
            PreTag={isInline ? "span" : "div"}
            children={children.replace(/\n$/, "")}
            language={language}
            style={theme.isDarkModeEnabled ? coldarkDark : coldarkCold}
        />
    );
}

const useStyles = tss
    .withName({ Code })
    .withParams<{ isInline: boolean }>()
    .create(({ theme, isInline }) => ({
        root: {
            borderRadius: theme.spacing(2),
            backgroundColor: `${theme.colors.useCases.surfaces.surface2} !important`,
            padding: isInline ? "3px !important" : undefined,
        },
    }));
