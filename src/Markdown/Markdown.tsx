import { memo, useMemo, createElement, lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import MuiLink from "@mui/material/Link";
import { symToStr } from "tsafe/symToStr";
import { id } from "tsafe/id";
import { tss } from "../lib/tss";
import { createUseAsync } from "../tools/useAsync";

const Code = lazy(() => import("./Code"));

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

const useRehypeRaw = createUseAsync(() =>
    import("rehype-raw").then(m => m.default),
);
const useRemarkGfm = createUseAsync(() =>
    import("remark-gfm").then(m => m.default),
);

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

    const rehypeRaw = useRehypeRaw();
    const remarkGfm = useRemarkGfm();

    const { classes, cx } = useStyles();

    return createElement(
        isInline ? "span" : "div",
        { lang: lang, className: cx(classes.root, className) },
        <ReactMarkdown
            rehypePlugins={[
                ...(remarkGfm === undefined ? [] : [remarkGfm]),
                ...(rehypeRaw === undefined ? [] : [rehypeRaw]),
            ]}
            components={{
                a: ({ href, children }) => {
                    const linkProps =
                        href === undefined ? {} : getLinkProps({ href });
                    return <MuiLink {...linkProps}>{children}</MuiLink>;
                },
                p: ({ children }) =>
                    createElement(isInline ? "span" : "p", { children }),
                code: isInline
                    ? props => (
                          <code
                              {...props}
                              className={cx(
                                  classes.code_inline,
                                  props.className,
                              )}
                          />
                      )
                    : props => (
                          <Suspense
                              fallback={
                                  <code
                                      {...props}
                                      className={cx(
                                          classes.code_inline,
                                          props.className,
                                      )}
                                  />
                              }
                          >
                              {/*@ts-expect-error: Just a mismatch between react type, will go away when updating react */}
                              <Code {...props} />
                          </Suspense>
                      ),
                img: props => (
                    <div className={classes.imgWrapper}>
                        <img
                            {...props}
                            className={cx(classes.img, props.className)}
                        />
                    </div>
                ),
            }}
        >
            {children}
        </ReactMarkdown>,
    );
});

Markdown.displayName = symToStr({ Markdown });

const useStyles = tss.withName("Markdown").create(({ theme }) => ({
    root: {
        "&& h1": {
            lineHeight: `${theme.typography.rootFontSizePx * 2.1}px`,
        },
        "&& h2": {
            lineHeight: `${theme.typography.rootFontSizePx * 1.7}px`,
        },
    },
    imgWrapper: {
        ...theme.spacing.topBottom("margin", 6),
        textAlign: "center",
    },
    img: {
        maxWidth: `min(100%, 1200px)`,
    },
    code_inline: {
        borderRadius: theme.spacing(2),
        backgroundColor: theme.colors.useCases.surfaces.surface2,
        padding: 3,
    },
}));

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
