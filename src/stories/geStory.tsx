import type { Meta, Story } from "@storybook/react";
import type { ArgType } from "@storybook/addons";
import { useEffect, useCallback } from "react";
import { symToStr } from "tsafe/symToStr";
import { useIsDarkModeEnabled } from "../lib";
import type { ThemeProviderProps } from "../lib";
import { ThemeProvider } from "./theme";
import { id } from "tsafe/id";
import "../assets/fonts/work-sans.css";
import { GlobalStyles } from "tss-react";

const browserFontSizes = [
    "Very small",
    "Small",
    "Medium (Recommended)",
    "Large",
    "Very Large",
] as const;

type BrowserFontSize = typeof browserFontSizes[number];

export function getStoryFactory<Props>(params: {
    sectionName: string;
    wrappedComponent: Record<string, (props: Props) => ReturnType<React.FC>>;
    /** https://storybook.js.org/docs/react/essentials/controls */
    argTypes?: Partial<Record<keyof Props, ArgType>>;
}) {
    const { sectionName, wrappedComponent, argTypes = {} } = params;

    const Component: any = Object.entries(wrappedComponent).map(
        ([, component]) => component,
    )[0];

    const Template: Story<
        Props & {
            darkMode: boolean;
            width: number;
            targetWindowInnerWidth: number;
            browserFontSize: BrowserFontSize;
        }
    > = ({
        darkMode,
        width,
        targetWindowInnerWidth,
        browserFontSize,
        ...props
    }) => {
        const { setIsDarkModeEnabled } = useIsDarkModeEnabled();

        useEffect(() => {
            setIsDarkModeEnabled(darkMode);
        }, [darkMode]);

        const getViewPortConfig = useCallback<
            NonNullable<ThemeProviderProps["getViewPortConfig"]>
        >(
            () => ({
                "targetBrowserFontSizeFactor": (() => {
                    switch (browserFontSize) {
                        case "Very small":
                            return 0.5625;
                        case "Small":
                            return 0.75;
                        case "Medium (Recommended)":
                            return 1;
                        case "Large":
                            return 1.25;
                        case "Very Large":
                            return 1.5;
                    }
                })(),
                targetWindowInnerWidth,
            }),
            [targetWindowInnerWidth, browserFontSizes],
        );

        return (
            <>
                {
                    <GlobalStyles
                        styles={{
                            "html": {
                                "font-size": "100% !important",
                            },
                            "body": {
                                "padding": `0 !important`,
                            },
                        }}
                    />
                }
                <ThemeProvider getViewPortConfig={getViewPortConfig}>
                    <div
                        style={{
                            "width": width || undefined,
                            "border": "1px solid black",
                        }}
                    >
                        <Component {...props} />
                    </div>
                </ThemeProvider>
            </>
        );
    };

    function getStory(props: Props): typeof Template {
        const out = Template.bind({});

        out.args = {
            "darkMode": false,
            "width": 0,
            "targetWindowInnerWidth": 1920,
            "browserFontSize": "Medium (Recommended)",
            ...props,
        };

        return out;
    }

    return {
        "meta": id<Meta>({
            "title": `${sectionName}/${symToStr(wrappedComponent)}`,
            "component": Component,
            "argTypes": {
                "width": {
                    "control": {
                        "type": "range",
                        "min": 0,
                        "max": 1920,
                        "step": 1,
                    },
                },
                "targetWindowInnerWidth": {
                    "control": {
                        "type": "range",
                        "min": 200,
                        "max": 2560,
                        "step": 1,
                    },
                },
                "browserFontSize": {
                    "options": browserFontSizes,
                    "control": { "type": "select" },
                },
                ...argTypes,
            },
        }),
        getStory,
    };
}

export function logCallbacks<T extends string>(
    propertyNames: readonly T[],
): Record<T, () => void> {
    const out: Record<T, () => void> = id<Record<string, never>>({});

    propertyNames.forEach(
        propertyName =>
            (out[propertyName] = console.log.bind(console, propertyName)),
    );

    return out;
}
