import { useReducer, memo, forwardRef } from "react";
import type { ReactNode } from "react";
import MuiAlert from "@mui/material/Alert";
import { Text } from "./Text";
import { tss } from "./lib/tss";
import { symToStr } from "tsafe/symToStr";
import { IconButton } from "./IconButton";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

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

export const Alert = memo(
    forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
        const { severity, children, className, ...rest } = props;

        const { classes, cx } = useStyles({
            severity,
            classesOverrides: props.classes,
        });

        const { isClosed, uncontrolledClose } = (function useClosure() {
            const [isClosed, uncontrolledClose] = useReducer(() => true, false);

            return {
                isClosed: "isClosed" in rest ? rest.isClosed : isClosed,
                uncontrolledClose,
            };
        })();

        if (isClosed) {
            return null;
        }

        return (
            <MuiAlert
                className={cx(classes.root, className)}
                ref={ref}
                severity={severity}
                classes={{
                    action: classes.action,
                    icon: classes.icon,
                }}
                action={
                    "doDisplayCross" in rest &&
                    rest.doDisplayCross && (
                        <IconButton
                            icon={CloseSharpIcon}
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
    }),
);

Alert.displayName = symToStr({ Alert });

const useStyles = tss
    .withName({ Alert })
    .withParams<{
        severity: AlertProps["severity"];
    }>()
    .create(({ theme, severity }) => ({
        root: {
            alignItems: "center",
            color: theme.colors.useCases.typography.textPrimary,
            backgroundColor:
                theme.colors.useCases.alertSeverity[severity].background,
        },
        icon: {
            "& svg": {
                color: theme.colors.useCases.alertSeverity[severity].main,
            },
        },
        action: {
            alignItems: "center",
            padding: 0,
        },
    }));
