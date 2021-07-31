import { DirectoryHeader } from "../DirectoryHeader";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { ReactComponent as ServicesSvg } from "./assets/svg/Services.svg";
import imgUrl from "./assets/img/utilitr.png";
import { useThemeBase } from "../lib/ThemeProvider";
import { css } from "tss-react";
import Avatar from "@material-ui/core/Avatar";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DirectoryHeader },
    "defaultWidth": 600,
});

export default meta;

const ImageSvg = () => {
    const theme = useThemeBase();

    return (
        <ServicesSvg
            className={css({
                "fill": theme.colors.useCases.typography.textPrimary,
                "height": "100%",
                "width": "unset",
            })}
        ></ServicesSvg>
    );
};

export const VueDefaultSvg = getStory({
    "image": <ImageSvg />,
    "title": "This is the title",
    "subtitle": "This is the subtitle",
    ...logCallbacks(["onGoBack"]),
});

export const VueWithoutSubtitle = getStory({
    "image": <ImageSvg />,
    "title": "This is the title",
    ...logCallbacks(["onGoBack"]),
});

export const VueImg = getStory({
    "image": (
        <Avatar
            style={{ "height": "100%", "width": "100%" }}
            src={imgUrl}
            alt=""
        />
    ),
    "title": "This is the title",
    "subtitle": "This is the subtitle",
    ...logCallbacks(["onGoBack"]),
});
