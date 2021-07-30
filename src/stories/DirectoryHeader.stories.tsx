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
    "defaultWidth": 600,
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

export const VueImg = getStory({
    "Image": ({ className }) => (
        <Avatar className={className} src={imgUrl} alt="" />
    ),
    "title": "This is the title",
    "subtitle": "This is the subtitle",
    ...logCallbacks(["onGoBack"]),
});
