import { IconButton } from "../IconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import { customIcons } from "./theme";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";

const icons = [
    HomeIcon,
    HelpIcon,
    customIcons.tourSvgUrl,
    customIcons.servicesSvgUrl,
] as const;

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { IconButton },
    argTypes: {
        icon: {
            options: icons,
            control: { type: "radio" },
        },
    },
});

export default meta;

export const Vue = getStory({
    icon: icons[0],
    ...logCallbacks(["onClick"]),
});
