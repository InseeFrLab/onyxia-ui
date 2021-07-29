import type { ReactNode } from "react";
import { makeStyles, Text } from "./lib/ThemeProvider";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import { memo } from "react";
import type { ComponentType } from "./tools/ComponentType";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { pxToNumber } from "./tools/pxToNumber";

/**
 * Image:
 *
 * If it's an SVG component make sure it has no width and heigh
 * property set on it.
 * Setting the height css property on the component should define
 * the width according to the image aspect ratio.
 *
 * If you pass an Avatar it has a defined width so you should
 * unset it or the image will be distorted. (See story)
 *
 */
export type Props = {
    Image: ComponentType<{ className: string }>;
    title: NonNullable<ReactNode>;
    subtitle?: NonNullable<ReactNode>;
    onGoBack(): void;
};

const { IconButton } = createIconButton(
    createIcon({
        "chevronLeft": ChevronLeftIcon,
    }),
);

const useStyles = makeStyles()(theme => ({
    "root": {
        "display": "flex",
        "alignItems": "center",
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
    },
    "image": {
        "margin": theme.spacing(4, 3),
        "marginLeft": theme.spacing(1),
        "height":
            pxToNumber(
                theme.typography.variants["object heading"].style.lineHeight,
            ) +
            pxToNumber(theme.typography.variants["caption"].style.lineHeight) +
            theme.spacing(2),
        "display": "block",
    },
    "subtitle": {
        "marginTop": theme.spacing(2),
        "color": theme.colors.useCases.typography.textSecondary,
        "textTransform": "capitalize",
    },
}));

export const DirectoryHeader = memo((props: Props) => {
    const { Image, title, subtitle, onGoBack } = props;

    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <IconButton
                    size="large"
                    iconId="chevronLeft"
                    onClick={onGoBack}
                />
            </div>
            <div>
                <Image className={classes.image} />
            </div>
            <div>
                <Text typo="object heading">{title}</Text>
                {subtitle !== undefined && (
                    <Text typo="caption" className={classes.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </div>
        </div>
    );
});
