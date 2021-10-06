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
import { GlobalStyles } from "tss-react";
import { objectKeys } from "tsafe/objectKeys";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import type { ReactComponent } from "../tools/ReactComponent";

export function getStoryFactory<Props extends Record<string, any>>(params: {
    sectionName: string;
    wrappedComponent: Record<string, ReactComponent<Props>>;
    /** https://storybook.js.org/docs/react/essentials/controls */
    argTypes?: Partial<Record<keyof Props, ArgType>>;
    defaultWidth?: number;
}) {
    const {
        sectionName,
        wrappedComponent,
        argTypes = {},
        defaultWidth,
    } = params;

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
            chromeFontSize: ChromeFontSize;
            targetWindowInnerWidth: number;
        }
    > = ({
        darkMode,
        width,
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
            }),
            [targetWindowInnerWidth, chromeFontSize],
        );

        const theme = useTheme();

        return (
            <ThemeProvider getViewPortConfig={getViewPortConfig}>
                <GlobalStyles
                    styles={{
                        "html": {
                            "fontSize": "100% !important",
                        },
                        "body": {
                            "padding": `0 !important`,
                            "backgroundColor": `${theme.colors.useCases.surfaces.surface1} !important`,
                        },
                    }}
                />
                <ScreenSize />
                <div
                    style={{
                        "width": width || undefined,
                        "border": "1px dashed #e8e8e8",
                        "display": "inline-block",
                    }}
                >
                    <Component {...props} />
                </div>
            </ThemeProvider>
        );
    };

    function getStory(props: Props): typeof Template {
        const out = Template.bind({});

        out.args = {
            "darkMode": false,
            "width": defaultWidth ?? 0,
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
