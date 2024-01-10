import type { ReactNode } from "react";
import { useState, memo } from "react";
import MuiDialog from "@mui/material/Dialog";
import { tss } from "./lib/tss";
import { Text } from "./Text";
import Checkbox from "@mui/material/Checkbox";
import { useConstCallback } from "powerhooks/useConstCallback";
import FormControlLabel from "@mui/material/FormControlLabel";
import { assert } from "tsafe/assert";
import type { DialogClasses as MuiDialogClasses } from "@mui/material/Dialog";
import { useStateRef } from "powerhooks/useStateRef";

/** To make the dialog fit content: "maxWidth": "unset" */
export type DialogProps = {
    className?: string;
    /** NOTE: If string, <Text typo="object heading" /> */
    title?: NonNullable<ReactNode>;
    /** NOTE: If string, <Text typo="body 1" /> */
    subtitle?: NonNullable<ReactNode>;
    /** NOTE: If string, <Text typo="body 2" /> */
    body?: NonNullable<ReactNode>;
    buttons: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onDoShowNextTimeValueChange?: (doShowNextTime: boolean) => void;
    doNotShowNextTimeText?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    /** https://mui.com/material-ui/api/dialog/ */
    muiDialogClasses?: Partial<MuiDialogClasses>;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
    fullWidth?: boolean;
};

const labelledby = "alert-dialog-title";
const describedby = "alert-dialog-description";

export const Dialog = memo((props: DialogProps) => {
    const {
        className,
        title,
        subtitle,
        body,
        isOpen,
        buttons,
        onDoShowNextTimeValueChange,
        onClose,
        doNotShowNextTimeText = "Don't show next time",
        muiDialogClasses,
        maxWidth,
        fullWidth,
    } = props;

    const { cx, classes } = useStyles({
        "classesOverrides": props.classes,
        isOpen,
    });

    const [isChecked, setIsChecked] = useState(false);

    const onChange = useConstCallback(() => {
        const isCheckedNewValue = !isChecked;

        setIsChecked(isCheckedNewValue);

        assert(onDoShowNextTimeValueChange !== undefined);

        onDoShowNextTimeValueChange(!isCheckedNewValue);
    });

    const mountPointRef = useStateRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={mountPointRef} about="Dialog container" />
            {mountPointRef.current !== null && (
                <MuiDialog
                    classes={{
                        ...muiDialogClasses,
                        "paper": cx(
                            muiDialogClasses?.paper,
                            classes.root,
                            className,
                        ),
                    }}
                    container={mountPointRef.current}
                    open={isOpen}
                    onClose={onClose}
                    aria-labelledby={labelledby}
                    aria-describedby={describedby}
                    maxWidth={maxWidth}
                    fullWidth={fullWidth}
                >
                    {title !== undefined &&
                        (typeof title !== "string" ? (
                            <div className={classes.title}>{title}</div>
                        ) : (
                            <Text
                                className={classes.title}
                                typo="object heading"
                                componentProps={{ "id": labelledby }}
                            >
                                {title}
                            </Text>
                        ))}
                    {subtitle !== undefined &&
                        (typeof subtitle !== "string" ? (
                            <div className={classes.subtitle}>{subtitle}</div>
                        ) : (
                            <Text
                                className={classes.subtitle}
                                componentProps={{ "id": describedby }}
                                typo="body 1"
                            >
                                {subtitle}
                            </Text>
                        ))}
                    {body !== undefined &&
                        (typeof body !== "string" ? (
                            <div className={classes.body}>{body}</div>
                        ) : (
                            <Text
                                className={classes.body}
                                htmlComponent="div"
                                typo="body 2"
                            >
                                {body}
                            </Text>
                        ))}

                    <div className={classes.buttons}>
                        <div className={classes.showNextTimeCheckboxesWrapper}>
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
                </MuiDialog>
            )}
        </>
    );
});

const useStyles = tss
    .withName({ Dialog })
    .withParams<{
        isOpen: boolean;
    }>()
    .create(({ theme, isOpen }) => ({
        "root": {
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "backgroundImage": "unset",
            "borderRadius": 5,
            "padding": theme.spacing(4),
            ...theme.spacing.rightLeft("margin", 4),
            "visibility": isOpen ? undefined : "hidden",
        },
        "buttons": {
            "display": "flex",
            "marginTop": theme.spacing(4),
            "& .MuiButton-root": {
                "marginLeft": theme.spacing(2),
            },
            "alignItems": "center",
        },
        "showNextTimeCheckboxesWrapper": {
            "flex": 1,
        },
        "title": {},
        "subtitle": {
            "marginTop": theme.spacing(3),
        },
        "body": {
            "marginTop": theme.spacing(3),
            "color": theme.colors.useCases.typography.textPrimary,
            "overflow": "visible",
        },
    }));
