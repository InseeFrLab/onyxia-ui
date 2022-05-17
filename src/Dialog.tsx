import type { ReactNode } from "react";
import { useState, useRef, memo } from "react";
import MuiDialog from "@mui/material/Dialog";
import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import Checkbox from "@mui/material/Checkbox";
import { useConstCallback } from "powerhooks/useConstCallback";
import FormControlLabel from "@mui/material/FormControlLabel";
import { assert } from "tsafe/assert";
import type { DialogClasses as MuiDialogClasses } from "@mui/material/Dialog";

export type DialogProps = {
    title?: NonNullable<ReactNode>;
    subtitle?: NonNullable<ReactNode>;
    body?: NonNullable<ReactNode>;
    buttons: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onDoShowNextTimeValueChange?: (doShowNextTime: boolean) => void;
    doNotShowNextTimeText?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    muiDialogClasses: Partial<MuiDialogClasses>;
};

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
        muiDialogClasses,
    } = props;

    const { classes } = useStyles(undefined, { props });

    const [isChecked, setIsChecked] = useState(false);

    const onChange = useConstCallback(() => {
        const isCheckedNewValue = !isChecked;

        setIsChecked(isCheckedNewValue);

        assert(onDoShowNextTimeValueChange !== undefined);

        onDoShowNextTimeValueChange(!isCheckedNewValue);
    });

    const mountPointRef = useRef<HTMLDivElement>(null);

    const getContainer = useConstCallback(() => {
        const element = mountPointRef.current;
        assert(element !== null);
        return element;
    });

    return (
        <>
            <div ref={mountPointRef} about="Dialog container" />
            <MuiDialog
                classes={muiDialogClasses}
                container={getContainer}
                open={isOpen}
                onClose={onClose}
                aria-labelledby={labelledby}
                aria-describedby={describedby}
                PaperComponent={({ children }) => (
                    <div className={classes.paper}>{children}</div>
                )}
            >
                <div className={classes.root}>
                    {title !== undefined && (
                        <Text
                            typo="object heading"
                            componentProps={{ "id": labelledby }}
                        >
                            {title}
                        </Text>
                    )}
                    {subtitle !== undefined && (
                        <Text
                            className={classes.subtitle}
                            componentProps={{ "id": describedby }}
                            typo="body 1"
                        >
                            {subtitle}
                        </Text>
                    )}
                    {body !== undefined && (
                        <Text
                            className={classes.body}
                            htmlComponent="div"
                            typo="body 2"
                        >
                            {body}
                        </Text>
                    )}

                    <div className={classes.buttonWrapper}>
                        <div className={classes.checkBoxWrapper}>
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
        </>
    );
});

const useStyles = makeStyles({ "name": { Dialog } })(theme => ({
    "root": {
        "padding": theme.spacing(4),
    },
    "buttonWrapper": {
        "display": "flex",
        "marginTop": theme.spacing(4),
        "& .MuiButton-root": {
            "marginLeft": theme.spacing(2),
        },
        "alignItems": "center",
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
        "marginTop": theme.spacing(3),
    },
    "body": {
        "marginTop": theme.spacing(2),
        "color": theme.colors.useCases.typography.textSecondary,
    },
}));
