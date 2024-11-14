import { ButtonBar } from "../ButtonBar";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import TourIcon from "@mui/icons-material/Tour";
import { customIcons } from "./theme";

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { ButtonBar },
});

export default meta;

export const VueDefault = getStory({
    buttons: [
        {
            buttonId: "btn1",
            icon: HelpIcon,
            isDisabled: false,
            label: "Label 1",
        },
        {
            buttonId: "btn2",
            icon: HomeIcon,
            isDisabled: false,
            label: "Label 2",
        },
        {
            buttonId: "btn3",
            icon: customIcons.servicesSvgUrl,
            isDisabled: true,
            label: "Label 3",
        },
        {
            buttonId: "btn4",
            icon: TourIcon,
            isDisabled: false,
            label: "Label 4",
        },
    ] as const,
    ...logCallbacks(["onClick"]),
});
