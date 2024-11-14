import * as React from "react";
import type { Meta, Story } from "@storybook/react";
import type { ArgType } from "@storybook/addons";
import { useMemo } from "react";
import { symToStr } from "tsafe/symToStr";
import { useTheme, breakpointsValues } from "../lib";
import { id } from "tsafe/id";
import { GlobalStyles } from "tss-react";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import type { ReactComponent } from "../tools/ReactComponent";
import { OnyxiaUi } from "./theme";
import { Text } from "../Text";
import { getIsDarkModeEnabledOsDefault } from "../tools/getIsDarkModeEnabledOsDefault";
import { assert, type Equals } from "tsafe/assert";
import { is } from "tsafe/is";

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

    type ReservedProps = {
        darkMode: boolean;
        width: number;
    };

    const reservedPropsName = ["darkMode", "width"] as const;

    assert<Equals<keyof ReservedProps, (typeof reservedPropsName)[number]>>();

    const Template: Story<Props & ReservedProps> = props => {
        const { darkMode, width, ...componentProps } = props;

        assert(
            Object.keys(componentProps).every(
                key => !id<readonly string[]>(reservedPropsName).includes(key),
            ),
        );
        assert(is<Props>(componentProps));

        return (
            <OnyxiaUi darkMode={darkMode}>
                <ContextualizedTemplate
                    width={width}
                    componentProps={componentProps}
                />
            </OnyxiaUi>
        );
    };

    const ContextualizedTemplate = ({
        width,
        componentProps,
    }: {
        componentProps: Props;
        width: number;
    }) => {
        const theme = useTheme();

        return (
            <>
                <GlobalStyles
                    styles={{
                        body: {
                            padding: `0 !important`,
                            backgroundColor: `${theme.colors.useCases.surfaces.surface1} !important`,
                        },
                        ".MuiScopedCssBaseline-root": {
                            padding: theme.spacing(4),
                        },
                    }}
                />
                <ScreenSize />
                <div
                    style={{
                        width: width || undefined,
                        border: `1px dashed ${theme.colors.useCases.typography.textTertiary}`,
                        display: "inline-block",
                    }}
                >
                    <Component {...componentProps} />
                </div>
            </>
        );
    };

    function getStory(props: Props): typeof Template {
        const out = Template.bind({});

        out.args = {
            darkMode: getIsDarkModeEnabledOsDefault(),
            width: defaultWidth ?? 0,
            ...props,
        };

        return out;
    }

    return {
        meta: id<Meta>({
            title: `${sectionName}/${symToStr(wrappedComponent)}`,
            component: Component,
            argTypes: {
                width: {
                    control: {
                        type: "range",
                        min: 0,
                        max: 1920,
                        step: 1,
                    },
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
