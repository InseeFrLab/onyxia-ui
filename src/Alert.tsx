import { useReducer, memo } from "react";
import type { ReactNode } from "react";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import MuiAlert from "@mui/material/Alert";
import { Text } from "./Text/TextBase";
import { makeStyles } from "./lib/ThemeProvider";
import CloseSharp from "@mui/icons-material/CloseSharp";

export type AlertProps =
    | AlertProps.NonClosable
    | AlertProps.ClosableControlled
    | AlertProps.ClosableUncontrolled;

export namespace AlertProps {
    export type Common = {
        className?: string;
        classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
        severity: "warning" | "info" | "error" | "success";
        children: NonNullable<ReactNode>;
    };

    export type NonClosable = Common;

    export type ClosableUncontrolled = Common & {
        doDisplayCross: true;
        onClose?: () => void;
    };

    export type ClosableControlled = Common & {
        doDisplayCross: true;
        isClosed: boolean;
        onClose: () => void;
    };
}

const { IconButton } = createIconButton(
    createIcon({
        "closeSharp": CloseSharp,
    }),
);

export const Alert = memo((props: AlertProps) => {
    const { severity, children, className, ...rest } = props;

    const { classes, cx } = useStyles({ severity }, { props });

    const { isClosed, uncontrolledClose } = (function useClosure() {
        const [isClosed, uncontrolledClose] = useReducer(() => true, false);

        return {
            "isClosed": "isClosed" in rest ? rest.isClosed : isClosed,
            uncontrolledClose,
        };
    })();

    if (isClosed) {
        return null;
    }

    return (
        <MuiAlert
            className={cx(classes.root, className)}
            severity={severity}
            classes={{
                "action": classes.action,
                "icon": classes.icon,
            }}
            action={
                "doDisplayCross" in rest &&
                rest.doDisplayCross && (
                    <IconButton
                        iconId="closeSharp"
                        aria-label="close"
                        onClick={
                            "isClosed" in rest
                                ? rest.onClose
                                : () => {
                                      rest.onClose?.();
                                      uncontrolledClose();
                                  }
                        }
                    />
                )
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

const useStyles = makeStyles<{ severity: AlertProps["severity"] }>({
    "name": { Alert },
})((theme, { severity }) => ({
    "root": {
        "alignItems": "center",
        "color": theme.colors.useCases.typography.textPrimary,
        "backgroundColor":
            theme.colors.useCases.alertSeverity[severity].background,
    },
    "icon": {
        "color": theme.colors.useCases.alertSeverity[severity].main,
    },
    "action": {
        "alignItems": "center",
        "padding": 0,
    },
}));
