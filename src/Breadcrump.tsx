import { makeStyles } from "./lib/ThemeProvider";
import { useMemo, useState, useEffect, memo } from "react";
import { Text } from "./Text/TextBase";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { Evt } from "evt";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";

export type BreadcrumpProps = {
    className?: string;
    path: string[];
    /** Default: 0 */
    minDepth?: number;
    /** Default false */
    isNavigationDisabled?: boolean;
    onNavigate(params: { path: string[]; upCount: number }): void;
    evtAction?: NonPostableEvt<{
        action: "DISPLAY COPY FEEDBACK";
        basename?: string;
    }>;
    /** Default "/", can be for example ">" or "\\" */
    separatorChar?: string;
};

export const Breadcrump = memo((props: BreadcrumpProps) => {
    const {
        minDepth = 0,
        isNavigationDisabled = false,
        onNavigate,
        className,
        evtAction,
        separatorChar = "/",
    } = props;

    const [path, setPath] = useState(props.path);

    const [isFocused, setIsFocused] = useState(false);

    //TODO: Design custom hook for that
    const [evtPropsPath] = useState(() => Evt.create<string[]>(props.path));
    useEffect(() => {
        evtPropsPath.state = props.path;
    }, [JSON.stringify(props.path)]);

    useEvt(
        ctx =>
            evtPropsPath.toStateless(ctx).attach(path => {
                setIsFocused(false);
                setPath(path);
            }),
        [evtPropsPath],
    );

    const evtDisplayFeedback = useEvt(
        ctx =>
            evtAction?.pipe(ctx, data =>
                data.action !== "DISPLAY COPY FEEDBACK" ? null : [data],
            ),
        [evtAction ?? Object],
    );

    useEvt(
        ctx =>
            evtDisplayFeedback?.attach(ctx, ({ basename }) => {
                setIsFocused(true);
                setPath([
                    ...evtPropsPath.state,
                    ...(basename ? [basename] : []),
                ]);

                const scopedCtx = Evt.newCtx();

                const timer = setTimeout(() => {
                    scopedCtx.done();
                    setIsFocused(false);
                    setPath(evtPropsPath.state);
                }, 500);

                scopedCtx.evtDoneOrAborted.attachOnce(() =>
                    clearTimeout(timer),
                );

                evtDisplayFeedback.attachOnce(scopedCtx, () =>
                    scopedCtx.done(),
                );
                evtPropsPath
                    .toStateless(scopedCtx)
                    .attachOnce(() => scopedCtx.done());

                ctx.evtDoneOrAborted.attachOnce(scopedCtx, () =>
                    scopedCtx.done(),
                );
            }),
        [evtDisplayFeedback, evtPropsPath],
    );

    const onClickFactory = useCallbackFactory<[string[], boolean], []>(
        ([partialPath, isClickable]) =>
            !isClickable
                ? assert(false)
                : onNavigate({
                      "path": partialPath,
                      "upCount": path.length - partialPath.length,
                  }),
    );

    const partialPaths = useMemo(
        () => getPartialPaths({ path, minDepth, isNavigationDisabled }),
        [JSON.stringify(path), minDepth, isNavigationDisabled],
    );

    return (
        <div className={className}>
            {partialPaths.map(({ isClickable, isLast, partialPath }) => (
                <Section
                    key={JSON.stringify(partialPath)}
                    {...{ isClickable, isLast, partialPath, isFocused }}
                    onClick={onClickFactory(partialPath, isClickable)}
                    separatorChar={separatorChar}
                />
            ))}
        </div>
    );
});

function getPartialPaths(params: {
    path: string[];
    minDepth: number;
    isNavigationDisabled: boolean;
}) {
    const { path, isNavigationDisabled } = params;
    const { minDepth } = params;

    return path.map((...[, i]) => {
        const isLast = i === path.length - 1;

        return {
            "partialPath": [...path].splice(0, i + 1),
            isLast,
            "isClickable": isNavigationDisabled
                ? false
                : !isLast && i >= minDepth,
        };
    });
}

const { Section } = (() => {
    type Props = ReturnType<typeof getPartialPaths>[number] & {
        onClick: (() => void) | undefined;
        isFocused: boolean;
        separatorChar: string;
    };

    const hoverFontWeight = 500;

    function Section(props: Props) {
        const {
            partialPath,
            isLast,
            onClick,
            isFocused,
            isClickable,
            separatorChar,
        } = props;

        const text = useMemo(
            () =>
                `${partialPath.slice(-1)[0]}${
                    isLast ? "" : ` ${separatorChar}`
                }`,
            [partialPath, isLast],
        );

        const { classes } = useStyles({ isClickable, isFocused, isLast, text });

        return (
            <Text
                typo="body 1"
                className={classes.root}
                componentProps={{
                    "onClick": isClickable ? onClick : undefined,
                }}
            >
                {text}
            </Text>
        );
    }

    const useStyles = makeStyles<
        Pick<Props, "isClickable" | "isFocused" | "isLast"> & { text: string }
    >({
        "name": `${symToStr({ Breadcrump })}${symToStr({ Section })}`,
    })((theme, { isClickable, isFocused, isLast, text }) => ({
        "root": {
            ...(!isClickable
                ? {}
                : {
                      "cursor": "pointer",
                      "&:hover": {
                          "fontWeight": hoverFontWeight,
                          "color": theme.colors.useCases.typography.textPrimary,
                      },
                      "&:active": {
                          "color": theme.colors.useCases.typography.textFocus,
                      },
                  }),
            "display": "inline-flex",
            "flexDirection": "column",
            "alignItems": "center",
            "justifyContent": "space-between",
            "&::after": {
                "content": `"${text}_"`,
                "height": 0,
                "visibility": "hidden",
                "overflow": "hidden",
                "userSelect": "none",
                "pointerEvents": "none",
                "fontWeight": hoverFontWeight,
                "@media speech": {
                    "display": "none",
                },
            },
            "color":
                theme.colors.useCases.typography[
                    isFocused
                        ? "textFocus"
                        : isLast
                        ? "textPrimary"
                        : "textSecondary"
                ],
        },
    }));

    return { Section };
})();
