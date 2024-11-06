import { CopyToClipboardIconButton } from "../CopyToClipboardIconButton";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import { css } from "./tss";

const { meta, getStory } = getStoryFactory({
    sectionName,
    wrappedComponent: { CopyToClipboardIconButton },
    defaultWidth: 600,
});

export default meta;

export const View = getStory({
    className: css({
        margin: "30px",
    }),
    textToCopy: "Text to be copied",
    copyToClipboardText: "Copy to clipboard",
    copiedToClipboardText: " Copied!",
    disabled: false,
});
