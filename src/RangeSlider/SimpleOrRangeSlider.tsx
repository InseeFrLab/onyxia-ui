import { useMemo, memo } from "react";
import Slider from "@mui/material/Slider";
import type { SliderProps } from "@mui/material/Slider";
import { assert } from "tsafe/assert";
import { is } from "tsafe/is";
import { useConstCallback } from "powerhooks/useConstCallback";
import { makeStyles } from "../lib/ThemeProvider";
import { Text } from "../Text/TextBase";
import type { ReactNode } from "react";
import { symToStr } from "tsafe/symToStr";
import { capitalize } from "tsafe/capitalize";
import { useWithProps } from "powerhooks/useWithProps";
import { useDomRect } from "powerhooks/useDomRect";
import { Tooltip } from "../Tooltip";
import { createIcon } from "../Icon";
import HelpIcon from "@mui/icons-material/Help";

export type SimpleOrRangeSliderProps = {
    className?: string;

    label: NonNullable<ReactNode>;
    min: number;
    max: number;
    step: number;
    unit: string;
    lowExtremitySemantic?: string;
    highExtremitySemantic?: string;
    extraInfo?: string;

    valueLow?: number;
    valueHigh: number;
    onValueChange(params: { extremity: "low" | "high"; value: number }): void;
};

const useStyles = makeStyles<{ isRange: boolean }>()((theme, { isRange }) => ({
    "label": {
        "marginBottom": theme.spacing(3),
    },
    "helpIcon": {
        "marginLeft": theme.spacing(2),
        "color": theme.colors.useCases.typography.textSecondary,
        "verticalAlign": "text-bottom",
    },
    "wrapper": {
        "display": "flex",
        "alignItems": "center",
    },
    "slider": {
        "flex": 1,
        //"margin": theme.spacing(0, 4),
        "margin": theme.spacing({ "topBottom": 0, "rightLeft": 4 }),
        "marginLeft": isRange ? undefined : 0,
        "minWidth": 150,
    },
}));

const { Icon } = createIcon({ "help": HelpIcon });

export const SimpleOrRangeSlider = memo((props: SimpleOrRangeSliderProps) => {
    const {
        className,
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

    const { classes } = useStyles({ "isRange": valueLow !== undefined });

    const muiSliderValue = useMemo(() => {
        if (valueLow === undefined) {
            return valueHigh;
        }

        assert(
            valueLow <= valueHigh,
            `RangeSlider error, ${symToStr({
                valueLow,
            })} must always be inferior or equal to ${symToStr({ valueHigh })}`,
        );

        return [valueLow, valueHigh];
    }, [valueLow ?? Object, valueHigh]);

    const onChange = useConstCallback<SliderProps["onChange"]>(
        (...[, value]: any[]) => {
            const [newValueLow, newValueHigh] = (() => {
                if (valueLow === undefined) {
                    assert(is<number>(value));

                    return [undefined, value] as const;
                } else {
                    assert(is<[number, number]>(value));

                    return value;
                }
            })();

            if (newValueLow !== undefined && newValueLow !== valueLow) {
                onValueChange({ "extremity": "low", "value": newValueLow });
            }

            if (newValueHigh !== valueHigh) {
                onValueChange({ "extremity": "high", "value": newValueHigh });
            }
        },
    );

    const textComponentProps = useMemo(
        () => ({
            "id": `text-${~~(Math.random() * 1000000)}`,
        }),
        [],
    );

    const ValueDisplayWp = useWithProps(ValueDisplay, {
        unit,
        "maxValue": max,
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
            <Text
                className={classes.label}
                typo="label 2"
                componentProps={textComponentProps}
            >
                {label}
                {extraInfo !== undefined && (
                    <Tooltip title={extraInfo}>
                        <Icon
                            iconId="help"
                            size="extra small"
                            className={classes.helpIcon}
                        />
                    </Tooltip>
                )}
            </Text>
            <div className={classes.wrapper}>
                {valueLow !== undefined && (
                    <ValueDisplayWp
                        semantic={lowExtremitySemantic}
                        value={valueLow}
                    />
                )}
                <Slider
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

const { ValueDisplay } = (() => {
    type Props = {
        unit: string;
        semantic: string | undefined;
        value: number;
        maxValue: number;
    };

    const useStyles = makeStyles<{ maxText: string }>()(
        (theme, { maxText }) => ({
            "root": {
                "display": "flex",
                "alignItems": "center",
            },
            "caption": {
                "color": theme.colors.useCases.typography.textSecondary,
            },
            "label": {
                "display": "inline-flex",
                "flexDirection": "column",
                "justifyContent": "space-between",
                "alignItems": "flex-start",
                "&::after": {
                    "content": `"${maxText}_"`,
                    "height": 0,
                    "visibility": "hidden",
                    "overflow": "hidden",
                    "userSelect": "none",
                    "pointerEvents": "none",
                    "@media speech": {
                        "display": "none",
                    },
                },
            },
        }),
    );

    const ValueDisplay = memo((props: Props) => {
        const { value, maxValue, unit, semantic } = props;

        const { classes } = useStyles({ "maxText": `${maxValue} ${unit}` });

        return (
            <div className={classes.root}>
                <div>
                    <Text typo="label 1" className={classes.label}>
                        {value} {unit}
                    </Text>
                    {semantic !== undefined && (
                        <Text className={classes.caption} typo="caption">
                            {capitalize(semantic)}
                        </Text>
                    )}
                </div>
            </div>
        );
    });

    return { ValueDisplay };
})();
