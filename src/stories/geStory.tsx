import type { Meta, Story } from "@storybook/react";
import type { ArgType } from "@storybook/addons";
import { useEffect, useCallback, useMemo } from "react";
import { symToStr } from "tsafe/symToStr";
import {
    useIsDarkModeEnabled,
    chromeFontSizesFactors,
    breakpointsValues,
} from "../lib";
import type { ThemeProviderProps, ChromeFontSize } from "../lib";
import { ThemeProvider, Text, useTheme } from "./theme";
import { id } from "tsafe/id";
import "../assets/fonts/work-sans.css";
import { GlobalStyles } from "tss-react";
import { objectKeys } from "tsafe/objectKeys";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";

const breakPointRanges = ["0-sm", "sm-md", "md-lg", "lg-xl", "xl-∞"] as const;
type BreakPointRange = typeof breakPointRanges[number];

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

    function ScreenSize() {
        const { windowInnerWidth } = useWindowInnerSize();

        const range = useMemo(() => {
            if (windowInnerWidth >= breakpointsValues["xl"]) {
                return "xl-∞";
            }

            if (windowInnerWidth >= breakpointsValues["lg"]) {
                return "lg-xl";
            }

            if (windowInnerWidth >= breakpointsValues["md"]) {
                return "md-lg";
            }

            if (windowInnerWidth >= breakpointsValues["sm"]) {
                return "sm-md";
            }

            return "0-sm";
        }, [windowInnerWidth]);

        return (
            <Text typo="body 1">
                {windowInnerWidth}px width: {range}
            </Text>
        );
    }

    const Template: Story<
        Props & {
            darkMode: boolean;
            width: number;
            //screenSize: BreakPointRange;
            chromeFontSize: ChromeFontSize;
            targetWindowInnerWidth: number;
        }
    > = ({
        darkMode,
        width,
        //screenSize,
        targetWindowInnerWidth,
        chromeFontSize,
        ...props
    }) => {
        const { setIsDarkModeEnabled } = useIsDarkModeEnabled();

        useEffect(() => {
            setIsDarkModeEnabled(darkMode);
        }, [darkMode]);

        const getViewPortConfig = useCallback<
            NonNullable<ThemeProviderProps["getViewPortConfig"]>
        >(
            ({ windowInnerWidth }) => ({
                "targetBrowserFontSizeFactor":
                    chromeFontSizesFactors[chromeFontSize],
                "targetWindowInnerWidth":
                    targetWindowInnerWidth || windowInnerWidth,
                /*
                "targetWindowInnerWidth": (()=>{
                    switch(screenSize){
                        case "0-sm": return breakpointsValues["sm"] / 2;
                        case "sm-md": return (breakpointsValues["md"] + breakpointsValues["sm"]) / 2;
                        case "md-lg": return (breakpointsValues["lg"] + breakpointsValues["md"])/2;
                        case "lg-xl": return (breakpointsValues["xl"] + breakpointsValues["lg"])/2;
                        case "xl-∞": return 3/2 * breakpointsValues["xl"];
                    }
                })(),
                */
            }),
            //[screenSize, chromeFontSize],
            [targetWindowInnerWidth, chromeFontSize],
        );

        const theme = useTheme();

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
                                "backgroundColor": `${theme.colors.useCases.surfaces.surface1} !important`,
                            },
                        }}
                    />
                }
                <ThemeProvider getViewPortConfig={getViewPortConfig}>
                    <ScreenSize />
                    <div
                        style={{
                            "width": width || undefined,
                            "border": "1px dotted grey",
                            "display": "inline-block",
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
            //"screenSize": id<BreakPointRange>("md-lg"),
            "targetWindowInnerWidth": 0,
            "chromeFontSize": "Medium (Recommended)",
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
                /*
                "screenSize": {
                    "options": breakPointRanges,
                    "control": { "type": "select" },
                },
                */
                "targetWindowInnerWidth": {
                    "control": {
                        "type": "range",
                        "min": 0,
                        "max": 2560,
                        "step": 10,
                    },
                },
                "chromeFontSize": {
                    "options": objectKeys(chromeFontSizesFactors),
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
