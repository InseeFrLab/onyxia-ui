import { useMemo, memo } from "react";
import Slider from "@mui/material/Slider";
import type { SliderProps } from "@mui/material/Slider";
import { assert, is } from "tsafe/assert";
import { useConstCallback } from "powerhooks/useConstCallback";
import { tss } from "../lib/tss";
import { Text } from "../Text";
import { symToStr } from "tsafe/symToStr";
import { capitalize } from "tsafe/capitalize";
import { useWithProps } from "powerhooks/useWithProps";
import { useDomRect } from "powerhooks/useDomRect";
import { Tooltip } from "../Tooltip";
import { Icon } from "../Icon";
import HelpIcon from "@mui/icons-material/Help";

export type SimpleOrRangeSliderProps = {
    className?: string;

    inputId?: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    lowExtremitySemantic?: string | JSX.Element;
    highExtremitySemantic?: string | JSX.Element;
    label?: JSX.Element | string;
    extraInfo?: string;

    valueLow: number;
    valueHigh: number;
    onValueChange: (params: { valueLow: number; valueHigh: number }) => void;
};

export const SimpleOrRangeSlider = memo((props: SimpleOrRangeSliderProps) => {
    const {
        className,
        inputId,
        label,
        min,
        max,
        step,
        unit,
        lowExtremitySemantic,
        highExtremitySemantic,
        extraInfo,
        valueLow,
        valueHigh,
        onValueChange,
    } = props;

    const isRange = !isNaN(valueLow);

    const { classes } = useStyles({ isRange });

    const muiSliderValue = useMemo(() => {
        if (!isRange) {
            return valueHigh;
        }

        assert(
            valueLow <= valueHigh,
            `RangeSlider error, ${symToStr({
                valueLow,
            })} must always be inferior or equal to ${symToStr({ valueHigh })}`,
        );

        return [valueLow, valueHigh];
    }, [valueLow, valueHigh]);

    const onChange = useConstCallback<SliderProps["onChange"]>(
        (...[, value]: any[]) => {
            if (isRange) {
                assert(is<[number, number]>(value));

                const [valueLow, valueHigh] = value;

                onValueChange({ valueLow, valueHigh });
            } else {
                assert(is<number>(value));

                onValueChange({ valueLow: NaN, valueHigh: value });
            }
        },
    );

    const textComponentProps = useMemo(
        () => ({
            id: `text-${~~(Math.random() * 1000000)}`,
        }),
        [],
    );

    const ValueDisplayWp = useWithProps(ValueDisplay, {
        unit,
        maxValue: max,
    });

    const {
        ref,
        domRect: { width },
    } = useDomRect();

    /* Display marks only if each marks separated by at least 5px */
    const marks = useMemo(
        () => (width * step) / (max - min) >= 5,
        [width, step, max, min],
    );

    return (
        <div className={className} ref={ref}>
            {label !== undefined && (
                <Text
                    className={classes.label}
                    typo="label 2"
                    componentProps={textComponentProps}
                >
                    {label}
                    {extraInfo !== undefined && (
                        <Tooltip title={extraInfo}>
                            <Icon
                                icon={HelpIcon}
                                size="extra small"
                                className={classes.helpIcon}
                            />
                        </Tooltip>
                    )}
                </Text>
            )}
            <div className={classes.wrapper}>
                {isRange && (
                    <ValueDisplayWp
                        semantic={lowExtremitySemantic}
                        value={valueLow}
                    />
                )}
                <Slider
                    id={inputId}
                    className={classes.slider}
                    value={muiSliderValue}
                    onChange={onChange}
                    step={step}
                    marks={marks}
                    min={min}
                    max={max}
                    valueLabelDisplay="off"
                    aria-labelledby={textComponentProps.id}
                />
                <ValueDisplayWp
                    semantic={highExtremitySemantic}
                    value={valueHigh}
                />
            </div>
        </div>
    );
});

const useStyles = tss
    .withName({ SimpleOrRangeSlider })
    .withParams<{ isRange: boolean }>()
    .create(({ theme, isRange }) => ({
        label: {
            marginBottom: theme.spacing(3),
        },
        helpIcon: {
            marginLeft: theme.spacing(2),
            color: theme.colors.useCases.typography.textSecondary,
            verticalAlign: "text-bottom",
        },
        wrapper: {
            display: "flex",
            alignItems: "center",
        },
        slider: {
            flex: 1,
            //"margin": theme.spacing(0, 4),
            margin: theme.spacing({ topBottom: 0, rightLeft: 4 }),
            marginLeft: isRange ? undefined : 0,
            minWidth: 150,
        },
    }));

const { ValueDisplay } = (() => {
    type Props = {
        unit: string;
        semantic: string | JSX.Element | undefined;
        value: number;
        maxValue: number;
    };

    const ValueDisplay = memo((props: Props) => {
        const { value, maxValue, unit, semantic } = props;

        const { classes } = useStyles({ maxText: `${maxValue} ${unit}` });

        return (
            <div className={classes.root}>
                <div>
                    <Text typo="label 1" className={classes.label}>
                        {value} {unit}
                    </Text>
                    {semantic !== undefined && (
                        <Text className={classes.caption} typo="caption">
                            {typeof semantic === "string"
                                ? capitalize(semantic)
                                : semantic}
                        </Text>
                    )}
                </div>
            </div>
        );
    });

    const useStyles = tss
        .withName({ ValueDisplay })
        .withParams<{ maxText: string }>()
        .create(({ theme, maxText }) => ({
            root: {
                display: "flex",
                alignItems: "center",
            },
            caption: {
                color: theme.colors.useCases.typography.textSecondary,
            },
            label: {
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                "&::after": {
                    content: `"${maxText}_"`,
                    height: 0,
                    visibility: "hidden",
                    overflow: "hidden",
                    userSelect: "none",
                    pointerEvents: "none",
                    "@media speech": {
                        display: "none",
                    },
                },
            },
        }));

    return { ValueDisplay };
})();
