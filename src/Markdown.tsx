import { memo, useMemo, createElement } from "react";
import ReactMarkdown from "react-markdown";
import MuiLink from "@mui/material/Link";
import { symToStr } from "tsafe/symToStr";
import { id } from "tsafe/id";
import { tss } from "./lib/tss";
import rehypeRaw from "rehype-raw";

export type MarkdownProps = {
    className?: string;
    children: string;
    getLinkProps?: MarkdownProps.GetLinkProps;
    /** Default: false */
    inline?: boolean;
    /** For accessibility only */
    lang?: string;
};

export namespace MarkdownProps {
    export type GetLinkProps = (params: {
        href: string;
    }) => React.ComponentProps<typeof MuiLink>;
}

export const Markdown = memo((props: MarkdownProps) => {
    const {
        className,
        children,
        getLinkProps = id<MarkdownProps.GetLinkProps>(({ href }) => ({
            href,
            ...(!href.startsWith("/") ? { target: "blank" } : {}),
        })),
        inline: isInline = false,
        lang = undefined,
    } = props;

    const { classes, cx } = useStyles();

    return createElement(
        isInline ? "span" : "div",
        { lang: lang, className: cx(classes.root, className) },
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                a: ({ href, children }) => {
                    const linkProps =
                        href === undefined ? {} : getLinkProps({ href });
                    return <MuiLink {...linkProps}>{children}</MuiLink>;
                },
                p: ({ children }) =>
                    createElement(isInline ? "span" : "p", { children }),
            }}
        >
            {children}
        </ReactMarkdown>,
    );
});

Markdown.displayName = symToStr({ Markdown });

const useStyles = tss.withName("Markdown").create({
    root: {},
});

export function createMarkdown(params: {
    getLinkProps: MarkdownProps.GetLinkProps;
}) {
    const { getLinkProps: getLinkProps_global } = params;

    const MarkdownWithLinkRenderer = (props: MarkdownProps) => {
        const { getLinkProps: getLinkProps_local, ...rest } = props;

        const getLinkProps = useMemo(
            (): MarkdownProps.GetLinkProps =>
                ({ href }) => ({
                    ...getLinkProps_global({ href }),
                    ...getLinkProps_local?.({ href }),
                }),
            [getLinkProps_local],
        );

        return <Markdown getLinkProps={getLinkProps} {...rest} />;
    };

    MarkdownWithLinkRenderer.displayName = Markdown.displayName;

    return { Markdown: MarkdownWithLinkRenderer };
}
