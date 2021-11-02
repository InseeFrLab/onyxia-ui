import { makeStyles } from "./lib/ThemeProvider";
import { Text } from "./Text/TextBase";
import { useState, useEffect, useMemo, useReducer, memo } from "react";
import type { ReactNode, RefObject } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiTextField from "@mui/material/TextField";
import type { PickOptionals } from "tsafe";
import { noUndefined } from "./tools/noUndefined";
import { getBrowser } from "./tools/getBrowser";
import InputAdornment from "@mui/material/InputAdornment";
import { createIconButton } from "./IconButton";
import { createIcon } from "./Icon";
import type { NonPostableEvt } from "evt";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { useEvt } from "evt/hooks";
import type { ReturnType } from "tsafe";
import { CircularProgress } from "./CircularProgress";
import { Tooltip } from "./Tooltip";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Help from "@mui/icons-material/Help";
import { useDomRect } from "powerhooks/useDomRect";

export type TextFieldProps = {
    className?: string | null;
    id?: string | null;
    name?: string | null;
    type?: "text" | "password" | "email";
    /** Will overwrite value when updated */
    defaultValue?: string;
    inputProps_ref?: RefObject<HTMLInputElement> | null;
    "inputProps_aria-label"?: string | null;
    inputProps_tabIndex?: number | null;
    inputProps_spellCheck?: boolean;
    inputProps_autoFocus?: boolean;
    InputProps_endAdornment?: ReactNode;
    disabled?: boolean;
    multiline?: boolean;
    /** Return false to e.preventDefault() and e.stopPropagation() */
    onEscapeKeyDown?(params: {
        preventDefaultAndStopPropagation(): void;
    }): void;
    onEnterKeyDown?(params: { preventDefaultAndStopPropagation(): void }): void;
    onBlur?(): void;

    /** To prevent onSubmit to be invoked (when data is being updated for example ) default true*/
    isSubmitAllowed?: boolean;
    evtAction?: NonPostableEvt<
        "TRIGGER SUBMIT" | "RESTORE DEFAULT VALUE"
    > | null;
    /** Submit invoked on evtAction.post("TRIGGER SUBMIT") only if value being typed is valid */
    onSubmit?(value: string): void;
    getIsValidValue?(
        value: string,
    ):
        | { isValidValue: true }
        | { isValidValue: false; message: string | ReactNode };
    /**
     * Invoked on first render,
     * called again if getIsValidValue have been updated and
     * the validity of the current value changes.
     */
    onValueBeingTypedChange?(
        params: { value: string } & ReturnType<
            TextFieldProps["getIsValidValue"]
        >,
    ): void;
    transformValueBeingTyped?: (value: string) => string;
    label?: React.ReactNode;
    helperText?: string;
    questionMarkHelperText?: string;
    doOnlyValidateInputAfterFistFocusLost?: boolean;
    isCircularProgressShown?: boolean;
    selectAllTextOnFocus?: boolean;
    autoComplete?:
        | "on"
        | "off"
        | "name"
        | "honorific-prefix"
        | "given-name"
        | "additional-name"
        | "family-name"
        | "honorific-suffix"
        | "nickname"
        | "email"
        | "username"
        | "new-password"
        | "current-password"
        | "one-time-code"
        | "organization-title"
        | "organization"
        | "street-address"
        | "address-line1"
        | "address-line2"
        | "address-line3"
        | "address-level4"
        | "address-level3"
        | "address-level2"
        | "address-level1"
        | "country"
        | "country-name"
        | "postal-code"
        | "cc-name"
        | "cc-given-name"
        | "cc-additional-name"
        | "cc-family-name"
        | "cc-number"
        | "cc-exp"
        | "cc-exp-month"
        | "cc-exp-year"
        | "cc-csc"
        | "cc-type"
        | "transaction-currency"
        | "transaction-amount"
        | "language"
        | "bday"
        | "bday-day"
        | "bday-month"
        | "bday-year"
        | "sex"
        | "tel"
        | "tel-country-code"
        | "tel-national"
        | "tel-area-code"
        | "tel-local"
        | "tel-extension"
        | "impp"
        | "url"
        | "photo";
};

const { Icon } = createIcon({
    "visibilityOff": VisibilityOff,
    "visibility": Visibility,
    "help": Help,
});

const { IconButton } = createIconButton({ Icon });

export const textFieldDefaultProps: PickOptionals<TextFieldProps> = {
    "label": null,
    "helperText": "",
    "questionMarkHelperText": "",
    "doOnlyValidateInputAfterFistFocusLost": true,
    "defaultValue": "",
    "className": null,
    "id": null,
    "name": null,
    "autoComplete": "off",
    "type": "text",
    "disabled": false,
    "multiline": false,
    "onEscapeKeyDown": () => {
        /*Do nothing*/
    },
    "onEnterKeyDown": () => {
        /*Do nothing*/
    },
    "onBlur": () => {
        /*Do nothing*/
    },
    "isSubmitAllowed": true,
    "onSubmit": () => {
        /*Do nothing*/
    },
    "getIsValidValue": () => ({ "isValidValue": true }),
    "evtAction": null,
    "onValueBeingTypedChange": () => {
        /*Do nothing*/
    },
    "transformValueBeingTyped": value => value,
    "isCircularProgressShown": false,
    "selectAllTextOnFocus": false,

    "inputProps_ref": null,
    "inputProps_aria-label": null,
    "inputProps_tabIndex": null,
    "inputProps_spellCheck": true,
    "inputProps_autoFocus": false,
    "InputProps_endAdornment": null,
};

const useStyles = makeStyles<{
    error: boolean;
    rootHeight: number;
}>()((theme, { error, rootHeight }) => ({
    "root": {
        "& .MuiFormHelperText-root": {
            "position": "absolute",
            "top": rootHeight,
            "visibility": rootHeight === 0 ? "hidden" : undefined,
        },
        "& .MuiFormLabel-root": {
            "color": error
                ? theme.colors.useCases.alertSeverity.error.main
                : theme.colors.useCases.typography.textSecondary,
        },
        "&:focus": {
            "outline": "unset",
        },
        "& input:-webkit-autofill": {
            ...(() => {
                switch (getBrowser()) {
                    case "chrome":
                    case "safari":
                        return {
                            "WebkitTextFillColor":
                                theme.colors.useCases.typography[
                                    theme.isDarkModeEnabled
                                        ? "textPrimary"
                                        : "textSecondary"
                                ],
                            "WebkitBoxShadow": `0 0 0 1000px ${theme.colors.useCases.surfaces.surface1} inset`,
                        };
                    default:
                        return {};
                }
            })(),
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            "borderBottomWidth": 1,
        },
        "& .MuiInput-underline:after": {
            "borderBottomWidth": 1,
        },
    },
    "helperText": {
        "color": error
            ? theme.colors.useCases.alertSeverity.error.main
            : theme.colors.useCases.typography.textDisabled,
        "whiteSpace": "nowrap",
    },
    "questionMark": {
        "fontSize": "inherit",
        ...(() => {
            const factor = 1.5;

            return {
                "width": `${factor}em`,
                "height": `${factor}em`,
            };
        })(),
    },
}));

export const TextField = memo((props: TextFieldProps) => {
    const completedProps = { ...textFieldDefaultProps, ...noUndefined(props) };

    const {
        transformValueBeingTyped,
        defaultValue,
        getIsValidValue,
        doOnlyValidateInputAfterFistFocusLost,
        onValueBeingTypedChange,
        onBlur,
        evtAction,
        onSubmit,
        onEscapeKeyDown,
        onEnterKeyDown,
        className,
        type,
        isCircularProgressShown,
        helperText,
        id,
        name,
        selectAllTextOnFocus,
        isSubmitAllowed,
        inputProps_ref,
        "inputProps_aria-label": inputProps_ariaLabel,
        inputProps_tabIndex,
        inputProps_spellCheck,
        inputProps_autoFocus,
        InputProps_endAdornment,
        questionMarkHelperText,
        ...completedPropsRest
    } = completedProps;

    const inputProps = useMemo(
        () => ({
            "ref": inputProps_ref ?? undefined,
            "aria-label": inputProps_ariaLabel ?? undefined,
            "tabIndex": inputProps_tabIndex ?? undefined,
            "spellCheck": inputProps_spellCheck,
            "autoFocus": inputProps_autoFocus,
        }),
        [
            inputProps_ref,
            inputProps_ariaLabel,
            inputProps_tabIndex,
            inputProps_spellCheck,
            inputProps_autoFocus,
        ],
    );

    const { value, transformAndSetValue } = (function useClosure() {
        const [value, setValue] = useState(defaultValue);

        const transformAndSetValue = useConstCallback((value: string) => {
            if (
                !isValidationEnabled &&
                !doOnlyValidateInputAfterFistFocusLost
            ) {
                enableValidation();
            }

            setValue(transformValueBeingTyped(value));
        });

        return { value, transformAndSetValue };
    })();

    useEffectOnValueChange(
        () => transformAndSetValue(defaultValue),
        [defaultValue],
    );

    const getIsValidValueResult = useMemo(
        () => getIsValidValue(value),
        [value, getIsValidValue],
    );

    useEffect(() => {
        onValueBeingTypedChange({ value, ...getIsValidValueResult });
    }, [
        value,
        getIsValidValueResult.isValidValue,
        getIsValidValueResult.isValidValue
            ? Object
            : getIsValidValueResult.message,
    ]);

    const [isValidationEnabled, enableValidation] = useReducer(
        () => true,
        false,
    );

    useEvt(
        ctx =>
            evtAction?.attach(ctx, action => {
                switch (action) {
                    case "RESTORE DEFAULT VALUE":
                        transformAndSetValue(defaultValue);
                        return;
                    case "TRIGGER SUBMIT":
                        if (
                            !getIsValidValueResult.isValidValue ||
                            !isSubmitAllowed
                        )
                            return;
                        onSubmit(value);
                        return;
                }
            }),
        [
            defaultValue,
            value,
            getIsValidValueResult,
            onSubmit,
            evtAction,
            transformAndSetValue,
            isSubmitAllowed,
        ],
    );

    const error = isValidationEnabled
        ? !getIsValidValueResult.isValidValue
        : false;

    const {
        domRect: { height: rootHeight },
        ref,
    } = useDomRect();

    const { classes, cx } = useStyles({
        error,
        rootHeight,
    });

    const [isPasswordShown, toggleIsPasswordShown] = useReducer(
        (v: boolean) => !v,
        false,
    );

    const onKeyDown = useConstCallback(
        (
            event: React.KeyboardEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
            >,
        ) => {
            const key = (() => {
                switch (event.key) {
                    case "Escape":
                    case "Enter":
                        return event.key;
                    default:
                        return "irrelevant";
                }
            })();

            if (key === "irrelevant") {
                return;
            }

            const preventDefaultAndStopPropagation = () => {
                event.preventDefault();
                event.stopPropagation();
            };

            switch (key) {
                case "Escape":
                    onEscapeKeyDown({ preventDefaultAndStopPropagation });
                    break;
                case "Enter":
                    onEnterKeyDown({ preventDefaultAndStopPropagation });
                    break;
            }
        },
    );

    const InputProps = useMemo(
        () => ({
            "endAdornment":
                InputProps_endAdornment ?? isCircularProgressShown ? (
                    <InputAdornment position="end">
                        <CircularProgress color="textPrimary" size={10} />
                    </InputAdornment>
                ) : type === "password" ? (
                    <InputAdornment position="end">
                        <IconButton
                            iconId={
                                isPasswordShown ? "visibilityOff" : "visibility"
                            }
                            onClick={toggleIsPasswordShown}
                        />
                    </InputAdornment>
                ) : undefined,
        }),
        [
            isPasswordShown,
            type,
            InputProps_endAdornment,
            isCircularProgressShown,
        ],
    );

    return (
        <MuiTextField
            ref={ref}
            variant="standard"
            type={
                type !== "password"
                    ? type
                    : isPasswordShown
                    ? "text"
                    : "password"
            }
            className={cx(classes.root, className)}
            value={value}
            error={error}
            helperText={
                <Text
                    className={classes.helperText}
                    typo="caption"
                    htmlComponent="span"
                >
                    {isValidationEnabled && !getIsValidValueResult.isValidValue
                        ? getIsValidValueResult.message || helperText
                        : helperText}
                    &nbsp;
                    {questionMarkHelperText !== "" && (
                        <Tooltip title={questionMarkHelperText}>
                            <Icon
                                iconId="help"
                                className={classes.questionMark}
                            />
                        </Tooltip>
                    )}
                </Text>
            }
            InputProps={InputProps}
            onBlur={useConstCallback(() => {
                if (!isValidationEnabled) enableValidation();
                onBlur();
            })}
            onChange={useConstCallback(
                ({
                    target,
                }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    transformAndSetValue(target.value),
            )}
            onKeyDown={onKeyDown}
            onFocus={useConstCallback(
                ({
                    target,
                }: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                >) => {
                    if (!selectAllTextOnFocus) return;
                    target.setSelectionRange(0, target.value.length);
                },
            )}
            id={id ?? undefined}
            name={name ?? undefined}
            inputProps={inputProps}
            {...completedPropsRest}
        />
    );
});
