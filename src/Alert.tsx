import { useReducer, memo } from "react";
import type { ReactNode } from "react";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import MuiAlert from "@material-ui/lab/Alert";
import { Typography } from "./Typography";
import { createUseClassNames } from "./lib/ThemeProvider";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import { cx } from "tss-react";
import CloseSharp from "@material-ui/icons/CloseSharp";

export type AlertProps = {
    className?: string | null;
    severity: "warning" | "info" | "error" | "info" | "success";
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

const { useClassNames } = createUseClassNames<Required<AlertProps>>()((theme, { severity }) => ({
    "root": {
        "color": theme.colors.useCases.typography.textPrimary,
        "backgroundColor": theme.colors.useCases.alertSeverity[severity].background,
        "& $icon": {
            "color": theme.colors.useCases.alertSeverity[severity].main,
        },
    },
    "text": {
        "paddingTop": 2,
    },
}));

export const Alert = memo((props: AlertProps) => {
    const completedProps = { ...alertDefaultProps, ...noUndefined(props) };

    const { severity, children, className, doDisplayCross } = completedProps;

    const [isClosed, close] = useReducer(() => true, false);

    const { classNames } = useClassNames(completedProps);

    return isClosed ? null : (
        <MuiAlert
            className={cx(classNames.root, className)}
            severity={severity}
            action={
                doDisplayCross ? (
                    <IconButton id="closeSharp" aria-label="close" onClick={close} />
                ) : undefined
            }
        >
            {typeof children === "string" ? (
                <Typography className={classNames.text}>{children}</Typography>
            ) : (
                children
            )}
        </MuiAlert>
    );
});
