import { memo } from "react";
import { useDomRect } from "powerhooks/useDomRect";
import type { ReactNode } from "react";
import { useCssAndCx } from "tss-react";

export type CollapsibleProps = {
    className?: string;
    isCollapsed: boolean;
    /** Default 250ms */
    transitionDuration?: number;
    children: ReactNode;
};

export const CollapsibleWrapper = memo((props: CollapsibleProps) => {
    const {
        className,
        transitionDuration = 250,
        isCollapsed,
        children,
    } = props;

    const { ref, domRect } = useDomRect();

    const { css, cx } = useCssAndCx();

    return (
        <div
            className={cx(
                css({
                    "height": isCollapsed ? 0 : domRect["height"] || undefined,
                    "transition": ["height", "padding", "margin"]
                        .map(prop => `${prop} ${transitionDuration}ms`)
                        .join(", "),
                    "overflow": "hidden",
                }),
                className,
            )}
        >
            <div ref={ref}>{children}</div>
        </div>
    );
});
