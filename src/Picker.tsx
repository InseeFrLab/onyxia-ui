/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from "react";
import { useState, memo } from "react";
import Popper from "@mui/material/Popper";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import type { AutocompleteCloseReason } from "@mui/material/Autocomplete";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { useEvt } from "evt/hooks";
import { tss } from "./lib/tss";
import { useClickAway } from "powerhooks/useClickAway";
import { Text } from "./Text";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { same } from "evt/tools/inDepth/same";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import type { StatefulReadonlyEvt } from "evt";
import { Evt } from "evt";
import { useConst } from "powerhooks/useConst";
import { arrDiff } from "evt/tools/reducers/diff";
import { Button } from "./Button";
import { useStateRef } from "powerhooks/useStateRef";
import { assert } from "tsafe/assert";
import type { NonPostableEvtLike } from "evt";
import { useNonPostableEvtLike } from "./tools/useNonPostableEvtLike";
import { createSpecificIcon } from "./Icon";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export type PickerProps = {
    className?: string;
    /** If undefined no color */
    getOptionColor?: (itemId: string) => string;
    options: {
        id: string;
        label: string;
    }[];
    selectedOptionIds: string[];
    onSelectedOption: (
        props:
            | ({ isSelect: true } & (
                  | { isNewOption: true; optionLabel: string }
                  | { isNewOption: false; optionId: string }
              ))
            | { isSelect: false; optionId: string },
    ) => void;
    onClose?: () => void;
    evtAction: NonPostableEvtLike<
        | {
              action: "open";
              anchorEl: HTMLElement;
          }
        | {
              action: "close";
          }
    >;
    texts?: {
        label?: NonNullable<ReactNode>;
        /**Undefined when we don't want to allow tags to be created*/
        "create option"?: (params: { optionLabel: string }) => ReactNode;
        done?: ReactNode;
    };
};

export const Picker = memo((props: PickerProps) => {
    const {
        className,
        getOptionColor,
        options,
        selectedOptionIds,
        onSelectedOption,
        onClose: onClose_props,
        evtAction: evtActionLike,
        texts = {},
    } = props;

    const evtAction = useNonPostableEvtLike(evtActionLike);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(
        undefined,
    );

    useEvt(
        ctx => {
            evtAction.$attach(
                data => (data.action === "open" ? [data] : null),
                ctx,
                ({ anchorEl }) => setAnchorEl(anchorEl),
            );
            evtAction.attach(
                ({ action }) => action === "close",
                ctx,
                () => onClose(),
            );
        },
        [evtAction],
    );

    const { classes, cx, theme } = useStyles();

    const onClose = useConstCallback(() => {
        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(undefined);
        onClose_props?.();
    });

    const { ref } = useClickAway({ onClickAway: onClose });

    const evtInputValue = useConst(() => Evt.create(""));

    const mountPointRef = useStateRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={mountPointRef} about="Picker container" />
            {mountPointRef.current !== null && (
                <Popper
                    className={cx(classes.root, className)}
                    container={mountPointRef.current}
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                >
                    <div ref={ref}>
                        {texts["label"] !== undefined && (
                            <div className={classes.labelWrapper}>
                                <Text typo="body 1">{texts["label"]}</Text>
                            </div>
                        )}
                        <Autocomplete
                            open
                            multiple
                            isOptionEqualToValue={same}
                            onClose={(
                                _: any,
                                reason: AutocompleteCloseReason,
                            ) => {
                                if (reason === "escape") {
                                    onClose();
                                }
                            }}
                            value={selectedOptionIds.map(optionId => ({
                                id: optionId,
                                label: (() => {
                                    const option = options.find(
                                        ({ id }) => id === optionId,
                                    );

                                    assert(option !== undefined);

                                    return option.label;
                                })(),
                                color: getOptionColor?.(optionId),
                            }))}
                            onChange={(event, newValue, reason) => {
                                if (
                                    event.type === "keydown" &&
                                    (event as React.KeyboardEvent).key ===
                                        "Backspace" &&
                                    reason === "removeOption"
                                ) {
                                    return;
                                }

                                const {
                                    added: [newlySelectedId],
                                    removed,
                                } = arrDiff(
                                    selectedOptionIds,
                                    newValue.map(({ id }) => id),
                                );

                                evtInputValue.state = "";

                                onSelectedOption(
                                    newlySelectedId !== undefined
                                        ? {
                                              isSelect: true,
                                              isNewOption: false,
                                              optionId: newlySelectedId,
                                          }
                                        : {
                                              isSelect: false,
                                              optionId: removed[0],
                                          },
                                );
                            }}
                            disableCloseOnSelect
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            PopperComponent={({
                                className,
                                disablePortal,
                                anchorEl,
                                open,
                                children,
                                ...other
                            }) => (
                                <div
                                    className={cx(
                                        classes.autocompletePopperComponent,
                                        className,
                                    )}
                                    {...other}
                                >
                                    {
                                        (assert(typeof children !== "function"),
                                        children)
                                    }
                                </div>
                            )}
                            renderTags={() => null}
                            noOptionsText={null}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Box
                                        component={createSpecificIcon(DoneIcon)}
                                        sx={{
                                            width: 17,
                                            height: 17,
                                            mr: "5px",
                                            ml: "-2px",
                                        }}
                                        style={{
                                            visibility: selected
                                                ? "visible"
                                                : "hidden",
                                        }}
                                    />
                                    {option.color !== undefined && (
                                        <Box
                                            component="span"
                                            sx={{
                                                width: 14,
                                                height: 14,
                                                flexShrink: 0,
                                                borderRadius: "3px",
                                                mr: 1,
                                                mt: "2px",
                                            }}
                                            style={{
                                                backgroundColor: option.color,
                                            }}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            "& span": {
                                                color:
                                                    theme.muiTheme.palette
                                                        .mode === "light"
                                                        ? "#586069"
                                                        : "#8b949e",
                                            },
                                        }}
                                    >
                                        {option.label}
                                    </Box>
                                    <Box
                                        component={createSpecificIcon(
                                            CloseIcon,
                                        )}
                                        sx={{
                                            opacity: 0.6,
                                            width: 18,
                                            height: 18,
                                        }}
                                        style={{
                                            visibility: selected
                                                ? "visible"
                                                : "hidden",
                                        }}
                                    />
                                </li>
                            )}
                            options={[...options]
                                .sort((a, b) => {
                                    // Display the selected tags first.
                                    const getWeight = (optionId: string) => {
                                        const i =
                                            selectedOptionIds.indexOf(optionId);

                                        return i === -1
                                            ? selectedOptionIds.length +
                                                  options
                                                      .map(({ id }) => id)
                                                      .indexOf(optionId)
                                            : i;
                                    };

                                    return getWeight(a.id) - getWeight(b.id);
                                })
                                .map(({ id, label }) => ({
                                    id,
                                    label,
                                    color: getOptionColor?.(id),
                                }))}
                            getOptionLabel={option => option.label}
                            renderInput={({
                                inputProps: { onChange, onBlur, ...inputProps },
                                ...params
                            }) => (
                                <InputBase
                                    className={classes.input}
                                    ref={params.InputProps.ref}
                                    inputProps={{
                                        ...inputProps,
                                        onChange: (...args) => {
                                            evtInputValue.state = (
                                                args[0] as React.ChangeEvent<HTMLInputElement>
                                            ).target.value;

                                            return (onChange as any)?.(...args);
                                        },
                                    }}
                                    autoFocus
                                    placeholder="Filter labels"
                                />
                            )}
                        />
                        {texts["done"] !== undefined && (
                            <div className={classes.doneButtonWrapper}>
                                <NoOptionText
                                    evtInputValue={evtInputValue}
                                    optionLabels={options.map(
                                        ({ label }) => label,
                                    )}
                                    onClick={inputValue =>
                                        onSelectedOption({
                                            isSelect: true,
                                            isNewOption: true,
                                            optionLabel: inputValue,
                                        })
                                    }
                                    texts={texts}
                                />
                                <div>&nbsp;</div>
                                <Button
                                    variant="secondary"
                                    className={classes.doneButton}
                                    onClick={onClose}
                                >
                                    {texts["done"]}
                                </Button>
                            </div>
                        )}
                    </div>
                </Popper>
            )}
        </>
    );
});

const useStyles = tss.withName("Picker").create(({ theme }) => ({
    root: {
        border: `1px solid ${
            theme.muiTheme.palette.mode === "light" ? "#e1e4e8" : "#30363d"
        }`,
        boxShadow: `0 8px 24px ${
            theme.muiTheme.palette.mode === "light"
                ? "rgba(149, 157, 165, 0.2)"
                : "rgb(1, 4, 9)"
        }`,
        borderRadius: 6,
        width: 300,
        zIndex: theme.muiTheme.zIndex.modal,
        fontSize: 13,
        color: theme.muiTheme.palette.mode === "light" ? "#24292e" : "#c9d1d9",
        backgroundColor:
            theme.muiTheme.palette.mode === "light" ? "#fff" : "#1c2128",
    },
    labelWrapper: {
        borderBottom: `1px solid ${
            theme.muiTheme.palette.mode === "light" ? "#eaecef" : "#30363d"
        }`,
        padding: "8px 10px",
    },
    autocompletePopperComponent: {
        [`& .${autocompleteClasses.paper}`]: {
            boxShadow: "none",
            margin: 0,
            color: "inherit",
            fontSize: 13,
        },
        [`& .${autocompleteClasses.listbox}`]: {
            backgroundColor:
                theme.muiTheme.palette.mode === "light" ? "#fff" : "#1c2128",
            padding: 0,
            [`& .${autocompleteClasses.option}`]: {
                minHeight: "auto",
                alignItems: "flex-start",
                padding: 8,
                borderBottom: `1px solid  ${
                    theme.muiTheme.palette.mode === "light"
                        ? " #eaecef"
                        : "#30363d"
                }`,
                '&[aria-selected="true"]': {
                    backgroundColor: "transparent",
                },
                [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
                    {
                        backgroundColor: theme.muiTheme.palette.action.hover,
                    },
            },
        },
        [`&.${autocompleteClasses.popperDisablePortal}`]: {
            position: "relative",
        },
    },
    input: {
        padding: 10,
        width: "100%",
        borderBottom: `1px solid ${
            theme.muiTheme.palette.mode === "light" ? "#eaecef" : "#30363d"
        }`,
        "& input": {
            borderRadius: 4,
            backgroundColor:
                theme.muiTheme.palette.mode === "light" ? "#fff" : "#0d1117",
            padding: 8,
            transition: theme.muiTheme.transitions.create([
                "border-color",
                "box-shadow",
            ]),
            border: `1px solid ${
                theme.muiTheme.palette.mode === "light" ? "#eaecef" : "#30363d"
            }`,
            fontSize: 14,
            "&:focus": {
                boxShadow: `0px 0px 0px 3px ${
                    theme.muiTheme.palette.mode === "light"
                        ? "rgba(3, 102, 214, 0.3)"
                        : "rgb(12, 45, 107)"
                }`,
                borderColor:
                    theme.muiTheme.palette.mode === "light"
                        ? "#0366d6"
                        : "#388bfd",
            },
        },
    },
    doneButtonWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    doneButton: {
        margin: theme.spacing(2),
    },
}));

const { NoOptionText } = (() => {
    type Props = {
        evtInputValue: StatefulReadonlyEvt<string>;
        optionLabels: string[];
        onClick: (inputValue: string) => void;
        texts: Pick<NonNullable<PickerProps["texts"]>, "create option">;
    };

    const NoOptionText = memo((props: Props) => {
        const { evtInputValue, optionLabels, onClick, texts } = props;

        useRerenderOnStateChange(evtInputValue);

        const inputValue = evtInputValue.state;

        const { classes } = useStyles();

        if (inputValue === "") {
            return null;
        }

        if (texts["create option"] === undefined) {
            return null;
        }

        if (optionLabels.indexOf(evtInputValue.state) !== -1) {
            return null;
        }

        return (
            <MuiLink
                className={classes.root}
                onClick={() => onClick(inputValue)}
            >
                {texts["create option"]({ optionLabel: inputValue })}
            </MuiLink>
        );
    });

    const useStyles = tss.withName({ NoOptionText }).create(({ theme }) => ({
        root: {
            cursor: "pointer",
            paddingLeft: theme.spacing(3),
        },
    }));

    return { NoOptionText };
})();
