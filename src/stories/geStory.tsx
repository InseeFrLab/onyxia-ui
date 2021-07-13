import type { Meta, Story } from "@storybook/react";
import type { ArgType } from "@storybook/addons";
import { useEffect } from "react";
import { symToStr } from "tsafe/symToStr";
import { useIsDarkModeEnabled } from "../lib";
import { ThemeProvider, useTheme } from "./theme";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { id } from "tsafe/id";
import "../assets/fonts/work-sans.css";

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

    const Template: Story<Props & { darkMode: boolean; width: number }> = ({
        darkMode,
        width,
        ...props
    }) => {
        const { setIsDarkModeEnabled } = useIsDarkModeEnabled();

        useEffect(() => {
            setIsDarkModeEnabled(darkMode);
        }, [darkMode]);

        const theme = useTheme();

        return (
            <ThemeProvider>
                <Box p={4} style={{ "backgroundColor": "white" }}>
                    <Box clone p={4} m={2} display="inline-block">
                        <Paper
                            style={{
                                "backgroundColor":
                                    theme.colors.useCases.surfaces.background,
                            }}
                        >
                            <div
                                style={{
                                    "border": `1px dotted ${theme.colors.useCases.typography.textDisabled}`,
                                    "width": width !== 0 ? width : undefined,
                                }}
                            >
                                <Component {...props} />
                            </div>
                        </Paper>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    };

    function getStory(props: Props): typeof Template {
        const out = Template.bind({});

        out.args = {
            "darkMode": false,
            "width": 0,
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
