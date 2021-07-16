import { createElement, useMemo, forwardRef, memo } from "react";
import type { Theme } from "./lib/ThemeProvider";
import { TypographyDesc } from "./lib/typography";
import type { PaletteBase, ColorUseCasesBase } from "./lib/color";
import { doExtends } from "tsafe/doExtends";
import type { Any } from "ts-toolbelt";
import { css, cx } from "tss-react";

export function createText<
    TypographyVariantNameCustom extends string = never,
>(params: {
    useTheme(): Theme<
        PaletteBase,
        ColorUseCasesBase,
        TypographyVariantNameCustom,
        Record<string, unknown>
    >;
}) {
    const { useTheme } = params;

    type TextProps = {
        className?: string | null;
        typo: TypographyVariantNameCustom | TypographyDesc.VariantNameBase;
        color?: "primary" | "secondary" | "disabled" | "focus";
        children: NonNullable<React.ReactNode>;
        htmlComponent?: TypographyDesc.HtmlComponent;
        componentProps?: JSX.IntrinsicElements[TypographyDesc.HtmlComponent];
    };

    const Text = memo(
        forwardRef<any, TextProps>((props, ref) => {
            const {
                className: classNameFromProps,
                children,
                typo: variantName,
                color = "primary",
                htmlComponent,
                componentProps = {},
                //For the forwarding, rest should be empty (typewise)
                ...rest
            } = props;

            //For the forwarding, rest should be empty (typewise),
            // eslint-disable-next-line @typescript-eslint/ban-types
            doExtends<Any.Equals<typeof rest, {}>, 1>();

            const theme = useTheme();

            const className = useMemo(
                () =>
                    cx(
                        css({
                            ...theme.typography.variants[variantName].style,
                            "color":
                                theme.colors.useCases.typography[
                                    (() => {
                                        switch (color) {
                                            case "primary":
                                                return "textPrimary";
                                            case "secondary":
                                                return "textSecondary";
                                            case "disabled":
                                                return "textDisabled";
                                            case "focus":
                                                return "textFocus";
                                        }
                                    })()
                                ],
                            "padding": 0,
                            "margin": 0,
                        }),
                        classNameFromProps,
                    ),
                [theme, variantName, classNameFromProps],
            );

            return createElement(
                htmlComponent ??
                    theme.typography.variants[variantName].htmlComponent,
                {
                    className,
                    ref,
                    ...componentProps,
                    ...rest,
                },
                children,
            );
        }),
    );

    return { Text };
}
