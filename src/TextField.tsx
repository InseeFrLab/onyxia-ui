import { tss } from "./lib/tss";
import { Text } from "./Text";
import { useState, useEffect, useMemo, useReducer, memo } from "react";
import type { ReactNode, RefObject } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiTextField from "@mui/material/TextField";
import { getBrowser } from "./tools/getBrowser";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { useEvt } from "evt/hooks";
import type { ReturnType } from "tsafe";
import { CircularProgress } from "./CircularProgress";
import { Tooltip } from "./Tooltip";
import { useDomRect } from "powerhooks/useDomRect";
import { assert, type Equals } from "tsafe/assert";
import Autocomplete from "@mui/material/Autocomplete";
import type { NonPostableEvtLike } from "evt";
import { useNonPostableEvtLike } from "./tools/useNonPostableEvtLike";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpIcon from "@mui/icons-material/Help";

export type TextFieldProps = {
    className?: string;
    id?: string;
    name?: string;
    /**
     * Default text
     * sensitive is not a real input type, what will actually be applied is "text"
     * It is to use when you have a field that should be hidden like a password but you don't want the browser to remember it.
     *
     * The method for hiding the characters without actually using the "password" input type that triggers the browser to
     * remember the password only works with chrome and safari. On other browsers like Firefox we will use the type "password";
     * */
    type?: "text" | "password" | "email" | "sensitive";
    /** Will overwrite value when updated */
    defaultValue?: string;
    inputProps_ref?: RefObject<HTMLInputElement>;
    "inputProps_aria-label"?: string;
    inputProps_className?: string;
    inputProps_tabIndex?: number;
    inputProps_spellCheck?: boolean;
    inputProps_autoFocus?: boolean;
    doIndentOnTab?: boolean;
    InputProps_endAdornment?: ReactNode;
    /** Only use when getIsValidValue isn't used */
    disabled?: boolean;
    /** Return false to e.preventDefault() and e.stopPropagation() */
    onEscapeKeyDown?: (params: {
        preventDefaultAndStopPropagation(): void;
    }) => void;
    onEnterKeyDown?: (params: {
        preventDefaultAndStopPropagation(): void;
    }) => void;
    onBlur?: () => void;

    /** To prevent onSubmit to be invoked (when data is being updated for example ) default true*/
    isSubmitAllowed?: boolean;
    evtAction?: NonPostableEvtLike<"TRIGGER SUBMIT" | "RESTORE DEFAULT VALUE">;
    /** Submit invoked on evtAction.post("TRIGGER SUBMIT") only if value being typed is valid */
    onSubmit?: (value: string) => void;
    getIsValidValue?: (
        value: string,
    ) =>
        | { isValidValue: true }
        | { isValidValue: false; message: string | ReactNode };
    /**
     * Invoked on first render,
     * called again if getIsValidValue have been updated and
     * the validity of the current value changes.
     */
    onValueBeingTypedChange?: (
        params: { value: string } & ReturnType<
            TextFieldProps["getIsValidValue"]
        >,
    ) => void;
    transformValueBeingTyped?: (value: string) => string;
    label?: ReactNode;
    /**
     * Not to use in conjunction with helperTextError and questionMarkHelperTextError
     */
    isErrored?: boolean;
    helperText?: ReactNode;
    /**
     * This is an alternative way of displaying errors to getIsValidValue.
     * This is to use when the input is controlled by a parent component.
     * If you use this you want to set the value with defaultValue dynamically.
     *
     * If provided, this will overwrite the helper text.
     * If is affected by doOnlyShowErrorAfterFirstFocusLost
     *
     * If you want to just display the helperText and question mark in red you
     * can set isErrored to true.
     */
    helperTextError?: ReactNode;
    questionMarkHelperText?: ReactNode;
    questionMarkHelperTextError?: ReactNode;
    doOnlyShowErrorAfterFirstFocusLost?: boolean;
    /** Default false */
    isCircularProgressShown?: boolean;
    selectAllTextOnFocus?: boolean;
    /** Default false */
    doRenderAsTextArea?: boolean;
    /** Only applies if doRenderAsTextArea is true */
    rows?: number;
    /** NOTE: If length 0 it's assumed loading */
    options?: string[];

    //NOTE: freeSolo only takes effects if options is provided.
    freeSolo?: boolean;

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

export const TextField = memo((props: TextFieldProps) => {
    const {
        transformValueBeingTyped,
        defaultValue = "",
        getIsValidValue,
        doOnlyShowErrorAfterFirstFocusLost = true,
        onValueBeingTypedChange,
        onBlur,
        evtAction: evtActionLike,
        onSubmit,
        onEscapeKeyDown,
        onEnterKeyDown,
        className,
        type: type_props = "text",
        isCircularProgressShown = false,
        isErrored,
        helperText,
        helperTextError,
        questionMarkHelperText,
        questionMarkHelperTextError,
        id: htmlId,
        name,
        selectAllTextOnFocus,
        isSubmitAllowed = true,
        inputProps_ref,
        "inputProps_aria-label": inputProps_ariaLabel,
        inputProps_className,
        inputProps_tabIndex,
        inputProps_spellCheck,
        inputProps_autoFocus,
        InputProps_endAdornment,
        doRenderAsTextArea = false,
        rows,
        doIndentOnTab = false,
        options,
        freeSolo = false,
        disabled,
        label,
        autoComplete,
        ...rest
    } = props;

    assert<Equals<typeof rest, {}>>();

    const otherMuiComponentProps = {
        disabled,
        label,
        autoComplete,
        ...rest,
    };

    const type = useMemo(() => {
        sensitive: {
            if (type_props !== "sensitive") {
                break sensitive;
            }

            switch (getBrowser()) {
                case "chrome":
                case "safari":
                    // NOTE: -webkit-text-security only work on chrome and safari
                    return "sensitive";
                default:
                    return "password";
            }
        }

        return type_props;
    }, [type_props]);

    const evtAction = useNonPostableEvtLike(evtActionLike);

    const { value, transformAndSetValue } = (function useClosure() {
        const [value, setValue] = useState(defaultValue);

        const transformAndSetValue = useConstCallback((value: string) =>
            setValue(transformValueBeingTyped?.(value) ?? value),
        );

        return { value, transformAndSetValue };
    })();

    useEffectOnValueChange(
        () => transformAndSetValue(defaultValue),
        [defaultValue],
    );

    const getIsValidValueResult = useMemo(
        () => getIsValidValue?.(value) ?? { "isValidValue": true as const },
        [value, getIsValidValue ?? Object],
    );

    useEffect(() => {
        onValueBeingTypedChange?.({ value, ...getIsValidValueResult });
    }, [
        value,
        getIsValidValueResult.isValidValue,
        getIsValidValueResult.isValidValue
            ? undefined
            : getIsValidValueResult.message,
    ]);

    const [shouldDisplayErrorIfAny, setShouldDisplayErrorIfAnyToTrue] =
        useReducer(() => true, !doOnlyShowErrorAfterFirstFocusLost);

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
                        ) {
                            return;
                        }
                        onSubmit?.(value);
                        return;
                }
            }),
        [
            defaultValue,
            value,
            getIsValidValueResult,
            onSubmit ?? Object,
            evtAction ?? Object,
            transformAndSetValue,
            isSubmitAllowed,
        ],
    );

    const isInputInErroredState = (() => {
        if (!shouldDisplayErrorIfAny) {
            return false;
        }

        if (isErrored === true) {
            return true;
        }

        if (
            helperTextError !== undefined ||
            questionMarkHelperTextError !== undefined
        ) {
            return true;
        }

        return !getIsValidValueResult.isValidValue;
    })();

    const {
        domRect: { height: rootHeight },
        ref,
    } = useDomRect();

    const [isInputValueHidden, toggleIsInputValueHidden] = useReducer(
        (v: boolean) => !v,
        true,
    );

    const { classes, cx } = useStyles({
        isInputInErroredState,
        rootHeight,
        "shouldInputValueBeHidden": type === "sensitive" && isInputValueHidden,
    });

    const onKeyDown = useConstCallback(
        (
            event: React.KeyboardEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
            >,
        ) => {
            const key = (() => {
                switch (event.key) {
                    case "Tab":
                        return doIndentOnTab ? event.key : "irrelevant";
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
                    onEscapeKeyDown?.({ preventDefaultAndStopPropagation });
                    return;
                case "Enter":
                    onEnterKeyDown?.({ preventDefaultAndStopPropagation });
                    return;
                case "Tab":
                    document.execCommand("insertText", false, "    ");
                    preventDefaultAndStopPropagation();
                    return;
            }

            assert<Equals<typeof key, never>>();
        },
    );

    const InputProps = useMemo(
        () => ({
            "endAdornment": (() => {
                if (InputProps_endAdornment ?? isCircularProgressShown) {
                    return (
                        <InputAdornment position="end">
                            <CircularProgress color="textPrimary" size={10} />
                        </InputAdornment>
                    );
                }

                if (type === "password" || type === "sensitive") {
                    return (
                        <InputAdornment position="end">
                            <IconButton
                                icon={
                                    isInputValueHidden
                                        ? VisibilityIcon
                                        : VisibilityOffIcon
                                }
                                onClick={toggleIsInputValueHidden}
                            />
                        </InputAdornment>
                    );
                }

                return undefined;
            })(),
        }),
        [
            isInputValueHidden,
            type,
            InputProps_endAdornment,
            isCircularProgressShown,
        ],
    );

    const inputProps = useMemo(
        () => ({
            "ref": inputProps_ref,
            "aria-label": inputProps_ariaLabel,
            "tabIndex": inputProps_tabIndex,
            "spellCheck": inputProps_spellCheck,
            "autoFocus": inputProps_autoFocus,
            "className": inputProps_className,
            ...(!isInputInErroredState ? undefined : { "aria-invalid": true }),
        }),
        [
            inputProps_ref,
            inputProps_ariaLabel,
            inputProps_tabIndex,
            inputProps_spellCheck,
            inputProps_autoFocus,
            isInputInErroredState,
            inputProps_className,
        ],
    );

    const onMuiTextfieldBlur = useConstCallback(() => {
        setShouldDisplayErrorIfAnyToTrue();
        onBlur?.();
    });
    const onFocus = useConstCallback(
        ({
            target,
        }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!selectAllTextOnFocus) return;
            target.setSelectionRange(0, target.value.length);
        },
    );

    const onInputChange = useConstCallback((_: any, value: string) =>
        transformAndSetValue(value),
    );
    const onChange = useConstCallback(
        ({
            target,
        }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            transformAndSetValue(target.value),
    );

    const helperTextNode = (() => {
        const helperTextOrError = (() => {
            if (isInputInErroredState) {
                if (helperTextError !== undefined) {
                    return helperTextError;
                }

                if (!getIsValidValueResult.isValidValue) {
                    return getIsValidValueResult.message;
                }
            }

            return helperText;
        })();

        const tooltipTitle = (() => {
            if (isInputInErroredState) {
                if (questionMarkHelperTextError !== undefined) {
                    return questionMarkHelperTextError;
                }

                // NOTE: If We have an error message and no question mark helper at all
                // We display the helper text as question mark helper so the information about
                // the field can still be accessed.
                if (
                    questionMarkHelperText === undefined &&
                    helperTextOrError !== helperText
                ) {
                    return helperText;
                }
            }

            return questionMarkHelperText;
        })();

        if (helperTextOrError === undefined && tooltipTitle === undefined) {
            return undefined;
        }

        return (
            <Text
                className={classes.helperText}
                typo="caption"
                htmlComponent="span"
            >
                {helperTextOrError !== undefined && helperTextOrError}
                {tooltipTitle !== undefined && (
                    <>
                        &nbsp;
                        <Tooltip title={tooltipTitle}>
                            <Icon
                                icon={HelpIcon}
                                className={classes.questionMark}
                            />
                        </Tooltip>
                    </>
                )}
            </Text>
        );
    })();

    if (options !== undefined) {
        assert(type === "text");

        return (
            <Autocomplete
                freeSolo={freeSolo}
                className={cx(classes.muiAutocomplete, className)}
                inputValue={value}
                onInputChange={onInputChange}
                options={options}
                id={htmlId}
                renderInput={params => (
                    <MuiTextField
                        {...params}
                        className={classes.muiTextField}
                        multiline={doRenderAsTextArea}
                        ref={ref}
                        variant="standard"
                        error={isInputInErroredState}
                        helperText={helperTextNode}
                        InputProps={{ ...params.InputProps, ...InputProps }}
                        onBlur={onMuiTextfieldBlur}
                        onKeyDown={onKeyDown}
                        onFocus={onFocus}
                        name={name}
                        inputProps={{
                            ...inputProps,
                            ...params.inputProps,
                            "className": cx(
                                params.inputProps?.className,
                                inputProps.className,
                            ),
                        }}
                        {...otherMuiComponentProps}
                    />
                )}
            />
        );
    }

    return (
        <MuiTextField
            className={cx(classes.muiTextField, className)}
            multiline={doRenderAsTextArea}
            rows={!doRenderAsTextArea ? undefined : rows}
            ref={ref}
            variant="standard"
            type={(() => {
                switch (type) {
                    case "password":
                        return isInputValueHidden ? "password" : "text";
                    case "sensitive":
                        return "text";
                    default:
                        return type;
                }
            })()}
            value={value}
            error={isInputInErroredState}
            helperText={helperTextNode}
            InputProps={InputProps}
            onBlur={onMuiTextfieldBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            id={htmlId}
            name={name}
            inputProps={inputProps}
            {...otherMuiComponentProps}
        />
    );
});

const useStyles = tss
    .withParams<{
        isInputInErroredState: boolean;
        rootHeight: number;
        shouldInputValueBeHidden: boolean;
    }>()
    .withName({ TextField })
    .create(
        ({
            theme,
            isInputInErroredState,
            rootHeight,
            shouldInputValueBeHidden,
        }) => ({
            "muiAutocomplete": {
                "minWidth": 145,
            },
            "muiTextField": {
                "& .MuiFormHelperText-root": {
                    "position": "absolute",
                    "top": rootHeight,
                    "visibility": rootHeight === 0 ? "hidden" : undefined,
                },
                "& .MuiFormLabel-root": {
                    "color": isInputInErroredState
                        ? theme.colors.useCases.alertSeverity.error.main
                        : undefined,
                },
                "&:focus": {
                    "outline": "unset",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    "borderBottomWidth": 1,
                },
                "& .MuiInput-underline:after": {
                    "borderBottomWidth": 1,
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
                "& input": {
                    ...(!shouldInputValueBeHidden
                        ? undefined
                        : {
                              "WebkitTextSecurity": "disc",
                          }),
                },
            },
            "helperText": {
                "color": isInputInErroredState
                    ? theme.colors.useCases.alertSeverity.error.main
                    : theme.colors.useCases.typography.textSecondary,
                "whiteSpace": "nowrap",
            },
            "questionMark": {
                "fontSize": "inherit",
                "position": "relative",
                "top": 1,
                "left": 2,
                ...(() => {
                    const factor = 1.3;

                    return {
                        "width": `${factor}em`,
                        "height": `${factor}em`,
                    };
                })(),
            },
        }),
    );
