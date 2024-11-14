import { Button } from "../Button";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";
import GoogleIcon from "@mui/icons-material/Google";
import HelpIcon from "@mui/icons-material/Help";

const { meta, getStory } = getStoryFactory({
    sectionName,
    argTypes: {
        variant: {
            options: ["primary", "secondary", "ternary"],
            control: { type: "radio" },
        },
    },
    wrappedComponent: { Button },
});

export default meta;

export const VueNoIcon = getStory({
    children: "Default",
    variant: "primary",
    ...logCallbacks(["onClick"]),
});

export const VueWithStartIcon = getStory({
    children: "Foo bar",
    startIcon: HelpIcon,
    variant: "primary",
    ...logCallbacks(["onClick"]),
});

export const WithManuallyAddedIcons = getStory({
    children: "Foo bar",
    startIcon: GoogleIcon,
    variant: "primary",
    ...logCallbacks(["onClick"]),
});
