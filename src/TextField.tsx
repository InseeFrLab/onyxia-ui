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
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
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
    /** Default text */
    type?: "text" | "password" | "email";
    /** Will overwrite value when updated */
    defaultValue?: string;
    inputProps_ref?: RefObject<HTMLInputElement>;
    "inputProps_aria-label"?: string;
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
    helperText?: ReactNode;
    /**
     * This is an alternative way of displaying errors to getIsValidValue.
     * This is to use when the input is controlled by a parent component.
     * If you use this you want to set the value with defaultValue dynamically.
     *
     * If provided, this will overwrite the helper text.
     * If is affected by doOnlyShowErrorAfterFirstFocusLost
     *
     * If you want to just display the helperText in red you can set this to true
     */
    helperTextError?: JSX.Element | string | boolean;
    questionMarkHelperText?: string | NonNullable<ReactNode>;
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
        type = "text",
        isCircularProgressShown = false,
        helperText,
        helperTextError,
        id: htmlId,
        name,
        selectAllTextOnFocus,
        isSubmitAllowed = true,
        inputProps_ref,
        "inputProps_aria-label": inputProps_ariaLabel,
        inputProps_tabIndex,
        inputProps_spellCheck,
        inputProps_autoFocus,
        InputProps_endAdornment,
        questionMarkHelperText,
        doRenderAsTextArea = false,
        rows,
        doIndentOnTab = false,
        options,
        freeSolo = false,
        ...completedPropsRest
    } = props;

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

        if (helperTextError !== undefined && helperTextError !== false) {
            return true;
        }

        return !getIsValidValueResult.isValidValue;
    })();

    const {
        domRect: { height: rootHeight },
        ref,
    } = useDomRect();

    const { classes, cx } = useStyles({
        isInputInErroredState,
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
            "endAdornment":
                InputProps_endAdornment ?? isCircularProgressShown ? (
                    <InputAdornment position="end">
                        <CircularProgress color="textPrimary" size={10} />
                    </InputAdornment>
                ) : type === "password" ? (
                    <InputAdornment position="end">
                        <IconButton
                            icon={
                                isPasswordShown
                                    ? VisibilityOffIcon
                                    : VisibilityIcon
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

    const inputProps = useMemo(
        () => ({
            "ref": inputProps_ref,
            "aria-label": inputProps_ariaLabel,
            "tabIndex": inputProps_tabIndex,
            "spellCheck": inputProps_spellCheck,
            "autoFocus": inputProps_autoFocus,
            ...(!isInputInErroredState ? undefined : { "aria-invalid": true }),
        }),
        [
            inputProps_ref,
            inputProps_ariaLabel,
            inputProps_tabIndex,
            inputProps_spellCheck,
            inputProps_autoFocus,
            isInputInErroredState,
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
            if (!isInputInErroredState) {
                return helperText;
            }

            if (helperTextError !== undefined) {
                assert(helperTextError !== false);
                return helperTextError === true ? helperText : helperTextError;
            }

            assert(!getIsValidValueResult.isValidValue);

            return getIsValidValueResult.message;
        })();

        const questionMarkHelperNode =
            questionMarkHelperText === undefined ? undefined : (
                <Tooltip title={questionMarkHelperText}>
                    <Icon icon={HelpIcon} className={classes.questionMark} />
                </Tooltip>
            );

        if (
            helperTextOrError === undefined &&
            questionMarkHelperNode === null
        ) {
            return undefined;
        }

        return (
            <Text
                className={classes.helperText}
                typo="caption"
                htmlComponent="span"
            >
                {helperTextOrError !== undefined && helperTextOrError}
                &nbsp;
                {questionMarkHelperNode !== undefined && questionMarkHelperNode}
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
                        inputProps={{ ...inputProps, ...params.inputProps }}
                        {...completedPropsRest}
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
            type={
                type !== "password"
                    ? type
                    : isPasswordShown
                    ? "text"
                    : "password"
            }
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
            {...completedPropsRest}
        />
    );
});

const useStyles = tss
    .withParams<{
        isInputInErroredState: boolean;
        rootHeight: number;
    }>()
    .withName({ TextField })
    .create(({ theme, isInputInErroredState, rootHeight }) => ({
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
            "color": isInputInErroredState
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
