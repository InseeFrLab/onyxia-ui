import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Link from "@mui/material/Link";

export type MarkdownProps = {
    className?: string;
    children: string;
    getDoesLinkShouldOpenNewTab?: (href: string) => boolean;
};

export const Markdown = memo((props: MarkdownProps) => {
    const {
        className,
        getDoesLinkShouldOpenNewTab = () => false,
        children,
    } = props;

    const renderers = useMemo(
        () => ({
            "link": (props: { href: string; children: ReactNode }) => (
                <Link
                    underline="hover"
                    href={props.href}
                    target={
                        getDoesLinkShouldOpenNewTab(props.href)
                            ? "_blank"
                            : undefined
                    }
                >
                    {props.children}
                </Link>
            ),
        }),
        [],
    );

    return (
        <ReactMarkdown className={className} renderers={renderers}>
            {children}
        </ReactMarkdown>
    );
});
