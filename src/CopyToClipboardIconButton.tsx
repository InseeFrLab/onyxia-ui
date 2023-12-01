import { useState, memo } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Tooltip } from "./Tooltip";
import { IconButton } from "./IconButton";
import { tss } from "./lib/tss";
import CheckIcon from "@mui/icons-material/Check";
import FilterNoneIcon from "@mui/icons-material/FilterNone";

type Props = {
    className?: string;
    copyToClipboardText?: string;
    copiedToClipboardText?: string;
    textToCopy: string;
    /** Default: false */
    disabled?: boolean;
};

export const CopyToClipboardIconButton = memo((props: Props) => {
    const {
        className,
        textToCopy,
        copiedToClipboardText = "Copied!",
        copyToClipboardText = "Copy to clipboard",
        disabled = false,
    } = props;

    const { isCopyFeedbackOn, onClick } = (function useClosure() {
        const [isCopyFeedbackOn, setIsCopyFeedbackOn] = useState(false);

        const onClick = useConstCallback(() => {
            navigator.clipboard.writeText(textToCopy);

            (async () => {
                setIsCopyFeedbackOn(true);

                await new Promise(resolve => setTimeout(resolve, 1000));

                setIsCopyFeedbackOn(false);
            })();
        });

        return { isCopyFeedbackOn, onClick };
    })();

    const { classes, cx } = useStyles({ isCopyFeedbackOn });

    const size = "small";

    return (
        <Tooltip
            title={
                isCopyFeedbackOn ? copiedToClipboardText : copyToClipboardText
            }
        >
            <IconButton
                className={cx(classes.root, className)}
                icon={isCopyFeedbackOn ? CheckIcon : FilterNoneIcon}
                onClick={onClick}
                size={size}
                disabled={disabled}
            />
        </Tooltip>
    );
});

const useStyles = tss
    .withName({ CopyToClipboardIconButton })
    .withParams<{ isCopyFeedbackOn: boolean }>()
    .create(({ theme, isCopyFeedbackOn }) => ({
        "root": {
            "&& svg": {
                "color": isCopyFeedbackOn
                    ? theme.colors.useCases.alertSeverity.success.main
                    : undefined,
            },
        },
    }));
