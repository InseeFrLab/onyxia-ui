import { createUseClassNames, useTheme } from "app/theme";
import { css, cx } from "tss-react";
import { useMemo, useState, useEffect, memo } from "react";
import type { NonPostableEvt } from "evt";
import { TextField } from "onyxia-ui";
import type { TextFieldProps } from "onyxia-ui";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";
import type { UnpackEvt } from "evt";
import { useTranslation } from "app/i18n/useTranslations";
import { Typography } from "onyxia-ui";
import { IconButton } from "app/theme";
import { useCallbackFactory } from "powerhooks";
import { useConstCallback } from "powerhooks";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import type { Parameters } from "tsafe";
import { useDomRect } from "onyxia-ui";
import type { Param0 } from "tsafe";


export type Props = {

    isLocked: boolean;

    /** NOTE: We can't use "key" as it's a reserved props*/
    keyOfSecret: string;
    strValue: string;
    onEdit(params: {
        editedKey: string | undefined;
        editedStrValue: string | undefined;
    }): void;
    onDelete(): void;
    getResolvedValue(params: { strValue: string; }): {
        isResolvedSuccessfully: true;
        resolvedValue: string;
    } | {
        isResolvedSuccessfully: false;
        message: string;
    };
    getIsValidAndAvailableKey(params: { key: string; }): {
        isValidAndAvailableKey: true;
    } | {
        isValidAndAvailableKey: false;
        message: string;
    };
    onStartEdit(): void;

    evtAction: NonPostableEvt<"ENTER EDITING STATE" | "SUBMIT EDIT">;

    isDarker: boolean;

};

const { useClassNames } = createUseClassNames<Props & { isInEditingState: boolean; }>()(
    (theme, { isInEditingState, isDarker }) => ({
        "root": {
            "backgroundColor": isDarker ?
                theme.colors.useCases.surfaces.background :
                "transparent",
            "& .MuiTextField-root": {
                "width": "100%"
            }
        },
        "dollarSign": {
            "color": isInEditingState ?
                theme.colors.useCases.typography.textDisabled :
                theme.colors.useCases.typography.textFocus
        },
        "valueAndResolvedValue": {
            "padding": theme.spacing(2, 1),
            //"wordBreak": "break-all"
        },
        "keyAndValueTableCells": {
            "padding": isInEditingState ? theme.spacing(0, 2) : undefined
        }
    })
);

export const MySecretsEditorRow = memo((props: Props) => {

    const { t } = useTranslation("MySecretsEditorRow");

    const {
        isLocked,
        keyOfSecret: key,
        strValue,
        onEdit,
        onDelete,
        getResolvedValue,
        getIsValidAndAvailableKey,
        onStartEdit,
        evtAction
    } = props;

    const [isInEditingState, setIsInEditingState] = useState(false);

    useEffect(
        () => {

            if (!isInEditingState) {
                return;
            }

            onStartEdit();

        },
        [isInEditingState, onStartEdit]
    );

    useEvt(
        ctx => {
            evtAction.attach(
                action => action === "ENTER EDITING STATE",
                ctx,
                () => setIsInEditingState(true)
            );
            evtAction.attach(
                action => (
                    action === "SUBMIT EDIT" &&
                    isInEditingState
                ),
                ctx,
                () => onSubmitButtonClick()
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [evtAction, isInEditingState]
    );

    const [evtInputAction] = useState(
        () => Evt.create<UnpackEvt<NonNullable<TextFieldProps["evtAction"]>>>()
    );

    const [evtEdited] = useState(() => Evt.create<{ editedKey?: string; editedStrValue?: string; }>({}));

    const onSubmitFactory = useCallbackFactory(
        ([inputTarget]: [keyof UnpackEvt<typeof evtEdited>], [value]: [Param0<TextFieldProps["onSubmit"]>]) =>
            evtEdited.state = { ...evtEdited.state, [inputTarget]: value }
    );

    useEvt(
        ctx => evtEdited.attach(
            ({ editedKey, editedStrValue }) =>
                editedKey !== undefined && editedStrValue !== undefined,
            ctx,
            ({ editedKey, editedStrValue }) => {

                evtEdited.state = {};

                setIsInEditingState(false);

                if (editedKey === key) {
                    editedKey = undefined;
                }

                if (editedStrValue === strValue) {
                    editedStrValue = undefined;
                }

                if (
                    editedKey === undefined &&
                    editedStrValue === undefined
                ) {
                    return;
                }

                onEdit({ editedKey, editedStrValue });

            }
        ),
        [evtEdited, onEdit, key, strValue]
    );

    const [isValidKey, setIsValidKey] = useState(false);
    const [isValidStrValue, setIsValidStrValue] = useState(false);

    const isSubmitButtonDisabled = isLocked || !isValidKey || !isValidStrValue;

    const onSubmitButtonClick = useConstCallback(
        () => {
            evtInputAction.post("TRIGGER SUBMIT");
            //setIsInEditingState(false);
        }
    );

    const onEscapeKeyDown = useConstCallback(
        () => evtInputAction.post("RESTORE DEFAULT VALUE")
    );

    const onEnterKeyDown = isSubmitButtonDisabled ? undefined : onSubmitButtonClick;



    const [strValueBeingTyped, setStrValueBeingTyped] = useState("");

    const onValueBeingTypedChange_key = useConstCallback(
        ({ isValidValue }: Parameters<NonNullable<TextFieldProps["onValueBeingTypedChange"]>>[0]) =>
            setIsValidKey(isValidValue)
    );

    const onValueBeingTypedChange_strValue = useConstCallback(
        ({ isValidValue, value }: Parameters<NonNullable<TextFieldProps["onValueBeingTypedChange"]>>[0]) => {

            setIsValidStrValue(isValidValue);

            setStrValueBeingTyped(value);

        }
    );

    const onEditButtonClick = useConstCallback(
        () => setIsInEditingState(true)
    );

    //NOTE: We don't want to use useMemo here because the resolved values depends on other keys.
    const resolveValueResult = getResolvedValue(
        { "strValue": isInEditingState ? strValueBeingTyped : strValue }
    );

    const getIsValidValue_key = useConstCallback(
        (value: Parameters<NonNullable<TextFieldProps["getIsValidValue"]>>[0]) => {

            const result = getIsValidAndAvailableKey({ "key": value });

            return result.isValidAndAvailableKey ?
                { "isValidValue": true } as const :
                { "isValidValue": false, "message": result.message } as const;

        }
    );

    const getIsValidValue_strValue = useConstCallback(
        (value: Parameters<TextFieldProps["getIsValidValue"]>[0]) => {

            const resolveValueResult = getResolvedValue({ "strValue": value });

            return resolveValueResult.isResolvedSuccessfully ?
                { "isValidValue": true } as const :
                { "isValidValue": false, "message": resolveValueResult.message } as const;

        }
    );

    const { classNames } = useClassNames({ ...props, isInEditingState });

    const SmartTrim = useMemo(
        () =>
            function SmartTim(props: {
                className: string;
                children: string;
            }) {

                const { children, className } = props;

                return (
                    <Typography className={cx(css({
                        "textOverflow": "ellipsis",
                        "overflow": "hidden",
                        "whiteSpace": "nowrap"
                    }), className)}>
                        {children}
                    </Typography>
                );

            },
        []
    );

    const theme = useTheme();

    const { ref, domRect: { width } } = useDomRect();

    return (
        <TableRow ref={ref} className={classNames.root}>
            <TableCell>
                <Typography
                    variant="body1"
                    className={cx(
                        classNames.dollarSign,
                        css({ "padding": theme.spacing(2, 1) })
                    )}
                >
                    $
                </Typography>
            </TableCell>
            <TableCell className={classNames.keyAndValueTableCells}>
                {
                    !isInEditingState ?
                        <Typography
                            variant="body1"
                            className={css({ "padding": theme.spacing(2, 1) })}
                        >
                            {key}
                        </Typography>
                        :
                        <TextField
                            defaultValue={key}
                            inputProps_aria-label={t("key input desc")}
                            inputProps_autoFocus={true}
                            onEscapeKeyDown={onEscapeKeyDown}
                            onEnterKeyDown={onEnterKeyDown}
                            evtAction={evtInputAction}
                            onSubmit={onSubmitFactory("editedKey")}
                            getIsValidValue={getIsValidValue_key}
                            onValueBeingTypedChange={onValueBeingTypedChange_key}
                            transformValueBeingTyped={toUpperCase}
                            doOnlyValidateInputAfterFistFocusLost={false}
                        />
                }</TableCell>
            <TableCell className={cx(classNames.keyAndValueTableCells, css(
                [width * 0.36].map(width => ({ width, "maxWidth": width }))[0]
            ))}>{
                    !isInEditingState ?
                        <SmartTrim className={classNames.valueAndResolvedValue}>
                            {strValue}
                        </SmartTrim>
                        :
                        <TextField
                            defaultValue={strValue}
                            inputProps_aria-label={t("value input desc")}
                            onEscapeKeyDown={onEscapeKeyDown}
                            onEnterKeyDown={onEnterKeyDown}
                            evtAction={evtInputAction}
                            onSubmit={onSubmitFactory("editedStrValue")}
                            getIsValidValue={getIsValidValue_strValue}
                            onValueBeingTypedChange={onValueBeingTypedChange_strValue}
                            doOnlyValidateInputAfterFistFocusLost={false}
                        />
                }</TableCell>
            <TableCell>{
                !resolveValueResult.isResolvedSuccessfully ?
                    null :
                    <SmartTrim
                        className={cx(
                            classNames.valueAndResolvedValue,
                            css({ "color": theme.colors.palette.light.greyVariant3 })
                        )}
                    >
                        {resolveValueResult.resolvedValue}
                    </SmartTrim>

            }</TableCell>
            <TableCell align="right">
                <div className={css({ "display": "flex" })}>
                    <IconButton
                        id={isInEditingState ? "check" : "edit"}
                        disabled={isInEditingState ? isSubmitButtonDisabled : isLocked}
                        onClick={isInEditingState ? onSubmitButtonClick : onEditButtonClick}
                        fontSize="small"
                    />
                    <IconButton
                        disabled={isLocked}
                        id="delete"
                        onClick={onDelete}
                        fontSize="small"
                    />
                </div>
            </TableCell>
        </TableRow>
    );

});

export declare namespace MySecretsEditorRow {

    export type I18nScheme = {
        'key input desc': undefined;
        'value input desc': undefined;
    };

}

function toUpperCase(value: string) {
    return value.toUpperCase();
}
