import { memo, useMemo, createElement } from "react";
import ReactMarkdown from "react-markdown";
import MuiLink from "@mui/material/Link";
import { symToStr } from "tsafe/symToStr";

export type Props = {
    className?: string;
    children: string;
    getLinkProps?: (params: {
        href: string;
    }) => React.ComponentProps<typeof MuiLink>;
    /** Default: false */
    allowHtml?: boolean;
    /** Default: false */
    inline?: boolean;
    /** For accessibility only */
    lang?: string;
};

export const Markdown = memo((props: Props) => {
    const {
        className,
        children,
        getLinkProps = ({ href }): React.ComponentProps<typeof MuiLink> => ({
            href,
            "target": href.startsWith("http") ? "_blank" : undefined,
        }),
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
                console.log(props);
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
    getLinkProps: (params: {
        href: string;
    }) => React.ComponentProps<typeof MuiLink>;
}) {
    const { getLinkProps } = params;

    const MarkdownWithLinkRenderer = (props: Omit<Props, "renderLink">) => (
        <Markdown getLinkProps={getLinkProps} {...props} />
    );

    MarkdownWithLinkRenderer.displayName = Markdown.displayName;

    return { "Markdown": MarkdownWithLinkRenderer };
}
