import { createElement, forwardRef, memo } from "react";
import type { Theme } from "../lib/ThemeProvider";
import { TypographyDesc } from "../lib/typography";
import type { PaletteBase, ColorUseCasesBase } from "../lib/color";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { createMakeStyles } from "tss-react";

export function createText<
    TypographyVariantNameCustom extends string = never,
>(params: {
    useTheme(): Theme<
        PaletteBase,
        ColorUseCasesBase,
        TypographyVariantNameCustom
    >;
}) {
    const { useTheme } = params;

    const { makeStyles } = createMakeStyles({ useTheme });

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
                className,
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
            assert<Equals<typeof rest, {}>>();

            const theme = useTheme();

            const { classes, cx } = useStyles({ variantName, color });

            return createElement(
                htmlComponent ??
                    theme.typography.variants[variantName].htmlComponent,
                {
                    "className": cx(classes.root, className),
                    ref,
                    ...componentProps,
                    ...rest,
                },
                children,
            );
        }),
    );

    const useStyles = makeStyles<{
        variantName: TextProps["typo"];
        color: NonNullable<TextProps["color"]>;
    }>({ "label": "Text" })((theme, { variantName, color }) => ({
        "root": {
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
        },
    }));

    return { Text };
}
