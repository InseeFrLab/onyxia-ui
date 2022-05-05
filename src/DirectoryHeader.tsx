import type { ReactNode } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import { memo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { pxToNumber } from "./tools/pxToNumber";

/**
 * image:
 *
 * If you pass an <Avatar /> (always square) make sure to set width and height: 100%
 *
 * If it's an SVG define the CSS as follow
 * Put "100%" on the BIGGER dimension and "unset" on the other. (You can tell by the viewBox)
 *
 * e.g:
 *
 * -----
 * |   |
 * |   |
 * |   |
 * -----
 *
 * "height": "100%",
 * "width": "unset"
 *
 * It's ok to set padding (top bottom) to configure the spacing with the divider.
 *
 */
export type Props = {
    className?: string;
    image: ReactNode;
    title: NonNullable<ReactNode>;
    subtitle?: NonNullable<ReactNode>;
    onGoBack(): void;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

const { IconButton } = createIconButton(
    createIcon({
        "chevronLeft": ChevronLeftIcon,
    }),
);

export const DirectoryHeader = memo((props: Props) => {
    const { className, image, title, subtitle, onGoBack } = props;

    const { classes, cx } = useStyles(undefined, { props });

    return (
        <div className={cx(classes.root, className)}>
            <div>
                <IconButton
                    size="large"
                    iconId="chevronLeft"
                    onClick={onGoBack}
                />
            </div>
            <div className={classes.imageWrapper}>{image}</div>
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

const useStyles = makeStyles({ "name": { DirectoryHeader } })(theme => ({
    "root": {
        "display": "flex",
        "alignItems": "center",
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
    },
    "imageWrapper": {
        "margin": theme.spacing({ "topBottom": 4, "rightLeft": 3 }),
        "marginLeft": theme.spacing(1),
        ...(() => {
            const height =
                pxToNumber(
                    theme.typography.variants["object heading"].style
                        .lineHeight,
                ) +
                pxToNumber(
                    theme.typography.variants["caption"].style.lineHeight,
                ) +
                theme.spacing(2);

            return {
                "width": height,
                height,
            };
        })(),
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
    },
    "subtitle": {
        "marginTop": theme.spacing(2),
        "color": theme.colors.useCases.typography.textSecondary,
        "textTransform": "capitalize",
    },
}));
