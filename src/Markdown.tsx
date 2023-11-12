import { memo, useMemo, createElement } from "react";
import ReactMarkdown from "react-markdown";
import MuiLink from "@mui/material/Link";
import { symToStr } from "tsafe/symToStr";
import { id } from "tsafe/id";

export type MarkdownProps = {
    className?: string;
    children: string;
    getLinkProps?: MarkdownProps.GetLinkProps;
    /** Default: false */
    allowHtml?: boolean;
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
            ...(!href.startsWith("/") ? { "target": "blank" } : {}),
        })),
        inline: isInline = false,
        allowHtml: doAllowHtml = false,
        lang,
    } = props;

    const renderers = useMemo(
        () => ({
            "link": ({
                href,
                children,
            }: {
                children: React.ReactNode;
                href: string;
            }) => <MuiLink {...getLinkProps({ href })}>{children}</MuiLink>,
            "paragraph": ({ children }: { children: React.ReactNode }) => {
                const as = isInline ? "span" : "p";
                return createElement(as, {
                    children,
                    lang,
                });
            },
        }),
        [getLinkProps, isInline],
    );

    return (
        <ReactMarkdown
            allowDangerousHtml={doAllowHtml}
            className={className}
            renderers={renderers}
        >
            {children}
        </ReactMarkdown>
    );
});

Markdown.displayName = symToStr({ Markdown });

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

    return { "Markdown": MarkdownWithLinkRenderer };
}
