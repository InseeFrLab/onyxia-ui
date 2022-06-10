import type { ReactNode } from "react";
import { useState, memo } from "react";
import Popper from "@mui/material/Popper";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import type { AutocompleteCloseReason } from "@mui/material/Autocomplete";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { makeStyles } from "./lib/ThemeProvider";
import { useClickAway } from "powerhooks/useClickAway";
import { Text } from "./Text/TextBase";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { same } from "evt/tools/inDepth/same";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import type { StatefulReadonlyEvt } from "evt";
import { Evt } from "evt";
import { useConst } from "powerhooks/useConst";

export type GitHubPickerProps = {
    className?: string;
    getTagColor: (tag: string) => string;
    evtAction: NonPostableEvt<{
        action: "open";
        anchorEl: HTMLElement;
        tags: string[];
        preSelectedTags: string[];
        onSelectedTags: (selectedTags: string[]) => void;
    }>;
    label?: NonNullable<ReactNode>;
    t: (key: "create tag", params: { tag: string }) => ReactNode;
};

export const GitHubPicker = memo((props: GitHubPickerProps) => {
    const { className, getTagColor, evtAction, label, t } = props;

    const [tags, setTags] = useState<string[]>([]);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(
        undefined,
    );

    const [onSelectedTags, setOnSelectedTags] = useState<
        (selectedTags: string[]) => void
    >(() => () => {
        /*never called*/
    });

    useEvt(
        ctx => {
            evtAction.$attach(
                data => (data.action === "open" ? [data] : null),
                ctx,
                ({ anchorEl, tags, preSelectedTags, onSelectedTags }) => {
                    setAnchorEl(anchorEl);
                    setTags(tags);
                    setSelectedTags(preSelectedTags);
                    setOnSelectedTags(() => onSelectedTags);
                },
            );
        },
        [evtAction],
    );

    const { classes, cx, theme } = useStyles();

    const onClose = useConstCallback(() => {
        onSelectedTags(selectedTags);

        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(undefined);
    });

    const { ref } = useClickAway({ "onClickAway": onClose });

    const evtInputValue = useConst(() => Evt.create(""));

    return (
        <Popper
            className={cx(classes.root, className)}
            open={!!anchorEl}
            anchorEl={anchorEl}
            placement="bottom-start"
        >
            <div ref={ref}>
                {label !== undefined && (
                    <div className={classes.labelWrapper}>
                        <Text typo="body 1">{label}</Text>
                    </div>
                )}
                <Autocomplete
                    open
                    multiple
                    isOptionEqualToValue={same}
                    onClose={(_: any, reason: AutocompleteCloseReason) => {
                        if (reason === "escape") {
                            onClose();
                        }
                    }}
                    value={selectedTags.map(tag => ({
                        tag,
                        "color": getTagColor(tag),
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
                        setSelectedTags(newValue.map(({ tag }) => tag));
                    }}
                    disableCloseOnSelect
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    PopperComponent={({
                        className,
                        disablePortal,
                        anchorEl,
                        open,
                        ...other
                    }) => (
                        <div
                            className={cx(
                                classes.autocompletePopperComponent,
                                className,
                            )}
                            {...other}
                        />
                    )}
                    renderTags={() => null}
                    noOptionsText={
                        <NoOptionText
                            evtInputValue={evtInputValue}
                            onClick={inputValue => {
                                setTags([inputValue, ...tags]);
                                setSelectedTags([inputValue, ...selectedTags]);
                            }}
                            t={t}
                        />
                    }
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Box
                                component={DoneIcon}
                                sx={{
                                    "width": 17,
                                    "height": 17,
                                    "mr": "5px",
                                    "ml": "-2px",
                                }}
                                style={{
                                    "visibility": selected
                                        ? "visible"
                                        : "hidden",
                                }}
                            />
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
                                style={{ backgroundColor: option.color }}
                            />
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    "& span": {
                                        color:
                                            theme.muiTheme.palette.mode ===
                                            "light"
                                                ? "#586069"
                                                : "#8b949e",
                                    },
                                }}
                            >
                                {option.tag}
                            </Box>
                            <Box
                                component={CloseIcon}
                                sx={{ opacity: 0.6, width: 18, height: 18 }}
                                style={{
                                    visibility: selected ? "visible" : "hidden",
                                }}
                            />
                        </li>
                    )}
                    options={tags
                        .sort((a, b) => {
                            // Display the selected tags first.
                            const getWeight = (tag: string) => {
                                let i = selectedTags.indexOf(tag);

                                return i === -1
                                    ? selectedTags.length + tags.indexOf(tag)
                                    : i;
                            };

                            return getWeight(a) - getWeight(b);
                        })
                        .map(tag => ({
                            tag,
                            "color": getTagColor(tag),
                        }))}
                    getOptionLabel={option => option.tag}
                    renderInput={({
                        inputProps: { onChange, ...inputProps },
                        ...params
                    }) => (
                        <InputBase
                            className={classes.input}
                            ref={params.InputProps.ref}
                            inputProps={{
                                ...inputProps,
                                "onChange": (...args) => {
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
            </div>
        </Popper>
    );
});

const useStyles = makeStyles({ "name": "GitHubPicker" })(theme => ({
    "root": {
        "border": `1px solid ${
            theme.muiTheme.palette.mode === "light" ? "#e1e4e8" : "#30363d"
        }`,
        "boxShadow": `0 8px 24px ${
            theme.muiTheme.palette.mode === "light"
                ? "rgba(149, 157, 165, 0.2)"
                : "rgb(1, 4, 9)"
        }`,
        "borderRadius": 6,
        "width": 300,
        "zIndex": theme.muiTheme.zIndex.modal,
        "fontSize": 13,
        "color":
            theme.muiTheme.palette.mode === "light" ? "#24292e" : "#c9d1d9",
        "backgroundColor":
            theme.muiTheme.palette.mode === "light" ? "#fff" : "#1c2128",
    },
    "labelWrapper": {
        "borderBottom": `1px solid ${
            theme.muiTheme.palette.mode === "light" ? "#eaecef" : "#30363d"
        }`,
        "padding": "8px 10px",
    },
    "autocompletePopperComponent": {
        [`& .${autocompleteClasses.paper}`]: {
            "boxShadow": "none",
            "margin": 0,
            "color": "inherit",
            "fontSize": 13,
        },
        [`& .${autocompleteClasses.listbox}`]: {
            "backgroundColor":
                theme.muiTheme.palette.mode === "light" ? "#fff" : "#1c2128",
            "padding": 0,
            [`& .${autocompleteClasses.option}`]: {
                "minHeight": "auto",
                "alignItems": "flex-start",
                "padding": 8,
                "borderBottom": `1px solid  ${
                    theme.muiTheme.palette.mode === "light"
                        ? " #eaecef"
                        : "#30363d"
                }`,
                '&[aria-selected="true"]': {
                    "backgroundColor": "transparent",
                },
                [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
                    {
                        "backgroundColor": theme.muiTheme.palette.action.hover,
                    },
            },
        },
        [`&.${autocompleteClasses.popperDisablePortal}`]: {
            "position": "relative",
        },
    },
    "input": {
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
}));

const { NoOptionText } = (() => {
    type Props = {
        evtInputValue: StatefulReadonlyEvt<string>;
        onClick: (inputValue: string) => void;
        t: GitHubPickerProps["t"];
    };

    const NoOptionText = memo((props: Props) => {
        const { evtInputValue, onClick, t } = props;

        useRerenderOnStateChange(evtInputValue);

        const inputValue = evtInputValue.state;

        if (inputValue === "") {
            return null;
        }

        return (
            <MuiLink onClick={() => onClick(inputValue)}>
                {t("create tag", { "tag": inputValue })}
            </MuiLink>
        );
    });

    return { NoOptionText };
})();
