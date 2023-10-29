import { memo, forwardRef, createElement } from "react";
import { assert, type Equals } from "tsafe/assert";
import { tss } from "./lib/tss";
import type { Theme } from "./lib/ThemeProvider";
import { symToStr } from "tsafe/symToStr";
import type { TypographyDesc } from "./lib/typography";

export type TextProps = {
    className?: string | null;
    //typo: TypographyVariantNameCustom | TypographyDesc.VariantNameBase;
    typo: TypographyDesc.VariantNameBase;
    color?: "primary" | "secondary" | "disabled" | "focus";
    children: NonNullable<React.ReactNode>;
    htmlComponent?: TypographyDesc.HtmlComponent;
    componentProps?: JSX.IntrinsicElements[TypographyDesc.HtmlComponent];

    fixedSize_enabled?: boolean;
    fixedSize_content?: string;
    fixedSize_fontWeight?: number;
};

export const Text = memo(
    forwardRef<any, TextProps>((props, ref) => {
        const {
            className,
            children,
            typo,
            color = "primary",
            htmlComponent,
            componentProps = {},
            fixedSize_enabled = false,
            fixedSize_content,
            fixedSize_fontWeight,
            //For the forwarding, rest should be empty (typewise)
            ...rest
        } = props;

        //For the forwarding, rest should be empty (typewise),
        // eslint-disable-next-line @typescript-eslint/ban-types
        assert<Equals<typeof rest, {}>>();

        const { classes, cx, theme } = useStyles({
            typo,
            color,
            fixedSize_enabled,
            fixedSize_content,
            fixedSize_fontWeight,
            "children":
                typeof children === "string" ? (children as string) : undefined,
        });

        return createElement(
            htmlComponent ?? theme.typography.variants[typo].htmlComponent,
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

Text.displayName = symToStr({ Text });

const useStyles = tss
    //.withName({ Text })
    .withParams<
        {
            color: NonNullable<TextProps["color"]>;
            children: string | undefined;
        } & Pick<
            TextProps,
            | "typo"
            | "fixedSize_enabled"
            | "fixedSize_content"
            | "fixedSize_fontWeight"
        >
    >()
    .create(
        ({
            theme,
            typo,
            color,
            fixedSize_enabled,
            fixedSize_fontWeight,
            fixedSize_content,
            children,
        }) => ({
            "root": {
                ...theme.typography.variants[typo].style,
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
                ...(!fixedSize_enabled
                    ? {}
                    : {
                          "display": "inline-flex",
                          "flexDirection": "column",
                          "alignItems": "center",
                          "justifyContent": "space-between",
                          "&::after": {
                              "content": fixedSize_content
                                  ? `"${fixedSize_content}"`
                                  : (assert(children !== undefined),
                                    `"${children}_"`),
                              "height": 0,
                              "visibility": "hidden",
                              "overflow": "hidden",
                              "userSelect": "none",
                              "pointerEvents": "none",
                              "fontWeight": fixedSize_fontWeight,
                              "@media speech": {
                                  "display": "none",
                              },
                          },
                      }),
            },
        }),
    );

export function createTextWithCustomTypos<
    TypographyVariantNameCustom extends string = never,
>(params: { useTheme: () => Theme<any, any, TypographyVariantNameCustom> }) {
    // NOTE: We do not actually need the theme here, it's just used for type inference.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { useTheme: _ } = params;

    return {
        "Text": Text as any as React.MemoExoticComponent<
            React.ForwardRefExoticComponent<
                (Omit<TextProps, "typo"> & {
                    typo:
                        | TypographyDesc.VariantNameBase
                        | TypographyVariantNameCustom;
                }) &
                    React.RefAttributes<any>
            >
        >,
    };
}
