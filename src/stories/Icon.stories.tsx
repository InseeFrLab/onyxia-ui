import { Icon } from "../Icon";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { customIcons } from "./theme";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import { id } from "tsafe/id";

const icons = [
    HomeIcon,
    HelpIcon,
    customIcons.tourSvgUrl,
    customIcons.servicesSvgUrl,
] as const;

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { Icon },
    argTypes: {
        icon: {
            options: icons,
            control: { type: "radio" },
        },
        size: {
            options: ["extra small", "small", "default", "medium", "large"],
            control: { type: "radio" },
        },
    },
});

export default meta;

export const Home = getStory({
    icon: icons[0],
    size: "default",
});
