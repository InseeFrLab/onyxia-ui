import { CopyToClipboardIconButton } from "../CopyToClipboardIconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { css } from "@emotion/css";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { CopyToClipboardIconButton },
    "defaultWidth": 600,
});

export default meta;

export const View = getStory({
    "className": css({
        "margin": "30px !important",
    }),
    "textToCopy": "Text to be copied",
    "copiedToClipboardText": "Copy to clipboard",
    "copyToClipboardText": "Copied!!",
    "disabled": false,
});
