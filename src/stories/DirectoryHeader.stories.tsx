import { DirectoryHeader } from "../DirectoryHeader";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { ReactComponent as ServicesSvg } from "./assets/svg/Services.svg";
import imgUrl from "./assets/img/utilitr.png";
import { useThemeBase } from "../lib/ThemeProvider";
import { css, cx } from "tss-react";
import Avatar from "@material-ui/core/Avatar";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DirectoryHeader },
});

export default meta;

const ImageSvg = (props: { className: string }) => {
    const { className } = props;

    const theme = useThemeBase();

    return (
        <ServicesSvg
            className={cx(
                css({ "fill": theme.colors.useCases.typography.textPrimary }),
                className,
            )}
        ></ServicesSvg>
    );
};

export const VueDefaultSvg = getStory({
    "Image": ImageSvg,
    "title": "This is the title",
    "subtitle": "This is the subtitle",
    ...logCallbacks(["onGoBack"]),
});

export const VueWithoutSubtitle = getStory({
    "Image": ImageSvg,
    "title": "This is the title",
    ...logCallbacks(["onGoBack"]),
});

const Image = (props: { className: string }) => {
    const { className } = props;

    return (
        <Avatar
            className={cx(css({ "width": "unset" }), className)}
            src={imgUrl}
            alt=""
        />
    );
};

export const VueImg = getStory({
    Image,
    "title": "This is the title",
    "subtitle": "This is the subtitle",
    ...logCallbacks(["onGoBack"]),
});
