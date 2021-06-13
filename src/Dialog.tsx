import type { ReactNode } from "react";
import { useState, memo } from "react";
import MuiDialog from "@material-ui/core/Dialog";
import { createUseClassNames } from "./lib/ThemeProvider";
import { Typography } from "./Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { useConstCallback } from "powerhooks";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { assert } from "tsafe/assert";

export type DialogProps = {
    title?: NonNullable<ReactNode>;
    subtitle?: NonNullable<ReactNode>;
    body?: NonNullable<ReactNode>;
    buttons: ReactNode;
    isOpen: boolean;
    onClose(): void;

    onDoShowNextTimeValueChange?(doShowNextTime: boolean): void;
    doNotShowNextTimeText?: string;
};

const { useClassNames } = createUseClassNames()(theme => ({
    "root": {
        "padding": theme.spacing(3),
    },
    "buttonWrapper": {
        "display": "flex",
        "marginTop": theme.spacing(3),
        "& .MuiButton-root": {
            "marginLeft": theme.spacing(1),
        },
    },
    "checkBoxWrapper": {
        "flex": 1,
    },
    "paper": {
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "boxShadow": theme.shadows[7],
        "borderRadius": 5,
        "maxWidth": 573,
    },
    "subtitle": {
        "marginTop": theme.spacing(2),
    },
    "body": {
        "marginTop": theme.spacing(1),
        "color": theme.colors.useCases.typography.textSecondary,
    },
}));

const labelledby = "alert-dialog-title";
const describedby = "alert-dialog-description";

export const Dialog = memo((props: DialogProps) => {
    const {
        title,
        subtitle,
        body,
        isOpen,
        buttons,
        onDoShowNextTimeValueChange,
        onClose,
        doNotShowNextTimeText = "Don't show next time",
    } = props;

    const { classNames } = useClassNames({});

    const [isChecked, setIsChecked] = useState(false);

    const onChange = useConstCallback(() => {
        const isCheckedNewValue = !isChecked;

        setIsChecked(isCheckedNewValue);

        assert(onDoShowNextTimeValueChange !== undefined);

        onDoShowNextTimeValueChange(!isCheckedNewValue);
    });

    return (
        <MuiDialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby={labelledby}
            aria-describedby={describedby}
            PaperComponent={({ children }) => <div className={classNames.paper}>{children}</div>}
        >
            <div className={classNames.root}>
                {title !== undefined && (
                    <Typography id={labelledby} variant="h5">
                        {title}
                    </Typography>
                )}
                {subtitle !== undefined && (
                    <Typography className={classNames.subtitle} id={describedby} variant="body1">
                        {subtitle}
                    </Typography>
                )}
                {body !== undefined && (
                    <Typography className={classNames.body} variant="body2">
                        {body}
                    </Typography>
                )}

                <div className={classNames.buttonWrapper}>
                    <div className={classNames.checkBoxWrapper}>
                        {onDoShowNextTimeValueChange !== undefined && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={onChange}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label={doNotShowNextTimeText}
                            />
                        )}
                    </div>
                    {buttons}
                </div>
            </div>
        </MuiDialog>
    );
});
