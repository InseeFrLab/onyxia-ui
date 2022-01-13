import { useReducer, memo } from "react";
import type { ReactNode } from "react";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import MuiAlert from "@mui/material/Alert";
import { Text } from "./Text/TextBase";
import { makeStyles } from "./lib/ThemeProvider";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import CloseSharp from "@mui/icons-material/CloseSharp";

export type AlertProps = {
    className?: string | null;
    severity: "warning" | "info" | "error" | "success";
    children: NonNullable<ReactNode>;
    doDisplayCross?: boolean;
};

export const alertDefaultProps: PickOptionals<AlertProps> = {
    "className": null,
    "doDisplayCross": false,
};

const { IconButton } = createIconButton(
    createIcon({
        "closeSharp": CloseSharp,
    }),
);

export const Alert = memo((props: AlertProps) => {
    const completedProps = { ...alertDefaultProps, ...noUndefined(props) };

    const { severity, children, className, doDisplayCross } = completedProps;

    const [isClosed, close] = useReducer(() => true, false);

    const { classes, cx } = useStyles(completedProps);

    return isClosed ? null : (
        <MuiAlert
            className={cx(classes.root, className)}
            severity={severity}
            action={
                doDisplayCross ? (
                    <IconButton
                        iconId="closeSharp"
                        aria-label="close"
                        onClick={close}
                    />
                ) : undefined
            }
        >
            {typeof children === "string" ? (
                <Text typo="label 2">{children}</Text>
            ) : (
                children
            )}
        </MuiAlert>
    );
});

const useStyles = makeStyles<Pick<AlertProps, "severity">>({
    "name": { Alert },
})((theme, { severity }) => ({
    "root": {
        "alignItems": "center",
        "color": theme.colors.useCases.typography.textPrimary,
        "backgroundColor":
            theme.colors.useCases.alertSeverity[severity].background,
        "& .MuiAlert-icon": {
            "color": theme.colors.useCases.alertSeverity[severity].main,
        },
        "& .MuiAlert-action": {
            "alignItems": "center",
            "padding": 0,
        },
    },
}));
