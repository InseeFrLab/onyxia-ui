import "minimal-polyfills/Object.fromEntries";
import React, { useEffect, useState, forwardRef, memo } from "react";
import memoize from "memoizee";
import { symToStr } from "tsafe/symToStr";

export type LazySvgProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    svgUrl: string;
};

export const LazySvg = memo(
    forwardRef<SVGSVGElement, LazySvgProps>((props, ref) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { svgUrl, children: _, ...svgComponentProps } = props;

        const [state, setState] = useState<
            | {
                  svgUrl: string;
                  svgRootAttrs: Record<string, string>;
                  svgInnerHtml: string;
              }
            | undefined
        >(undefined);

        useEffect(() => {
            let isActive = true;

            (async () => {
                const resp = await svgUrlToSvgComponent(svgUrl);

                if (!isActive || resp === undefined) {
                    return;
                }

                setState(currentState => {
                    if (currentState?.svgUrl === svgUrl) {
                        return currentState;
                    }

                    return {
                        svgUrl,
                        "svgInnerHtml": resp.svgInnerHtml,
                        "svgRootAttrs": resp.svgRootAttrs,
                    };
                });
            })();

            return () => {
                isActive = false;
            };
        }, []);

        if (state === undefined) {
            return null;
        }

        const {
            svgRootAttrs: { class: class_svgRootAttrs, ...svgRootAttrs },
            svgInnerHtml,
        } = state;

        return (
            <svg
                ref={ref}
                {...svgRootAttrs}
                {...svgComponentProps}
                className={[class_svgRootAttrs, svgComponentProps.className]
                    .filter(className => !!className)
                    .join(" ")}
                dangerouslySetInnerHTML={{ "__html": svgInnerHtml }}
            />
        );
    }),
);

LazySvg.displayName = symToStr({ LazySvg });

export const createDynamicSvg = memoize((svgUrl: string) => {
    const DynamicSvgWithUrl = forwardRef<
        SVGSVGElement,
        Omit<LazySvgProps, "svgUrl" | "ref">
    >((props, ref) => <LazySvg svgUrl={svgUrl} ref={ref} {...props} />);

    DynamicSvgWithUrl.displayName = LazySvg.displayName;

    return DynamicSvgWithUrl;
});

const svgUrlToSvgComponent = memoize(
    async (svgUrl: string) => {
        const rawSvgString = await fetch(svgUrl)
            .then(response => response.text())
            .catch(() => undefined);

        if (rawSvgString === undefined) {
            console.error(`Failed to fetch ${svgUrl}`);
            return undefined;
        }

        const svgElement = (() => {
            let svgElement: SVGSVGElement | null;

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    rawSvgString,
                    "image/svg+xml",
                );
                svgElement = doc.querySelector("svg");
            } catch (error) {
                console.error(`Failed to parse ${svgUrl}, ${String(error)}`);
                return undefined;
            }

            if (svgElement === null) {
                console.error(`${svgUrl} is empty`);
                return undefined;
            }

            return svgElement;
        })();

        if (svgElement === undefined) {
            return undefined;
        }

        const svgRootAttrs = Object.fromEntries(
            Array.from(svgElement.attributes).map(({ name, value }) => [
                name,
                value,
            ]),
        );

        const svgInnerHtml = svgElement.innerHTML;

        return {
            svgInnerHtml,
            svgRootAttrs,
        };
    },
    { "promise": true },
);
