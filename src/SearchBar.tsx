import { useRef, useState, memo } from "react";
import type { ChangeEventHandler } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useClickAway } from "powerhooks/useClickAway";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { createIcon } from "./Icon";
import { createIconButton } from "./IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

const { Icon } = createIcon({
    "search": SearchIcon,
    "cancel": CancelIcon,
});

const { IconButton } = createIconButton({ Icon });

export type SearchBarProps = {
    className?: string;
    search: string;
    onSearchChange(search: string): void;
    onKeyPress?(key: "Enter" | "Escape"): void;
    evtAction?: NonPostableEvt<"CLEAR SEARCH">;
    /** Default "Search" */
    placeholder?: string;
};

export const SearchBar = memo((props: SearchBarProps) => {
    const {
        className,
        onSearchChange,
        onKeyPress,
        search,
        placeholder = "Search",
        evtAction,
    } = props;

    const [isActive, setIsActive] = useState(search !== "");

    const { classes, cx } = useStyles({ isActive });

    const onClearButtonClick = useConstCallback(() => {
        onSearchChange("");
        inputRef.current?.focus();
    });
    const onRootClick = useConstCallback(() => setIsActive(true));
    const onIconClick = useConstCallback(() => {
        const { current: inputEl } = inputRef;
        if (inputEl === null) return;
        inputEl.focus();
        inputEl.setSelectionRange(0, search.length);
    });
    const onInputChange = useConstCallback<
        ChangeEventHandler<HTMLInputElement>
    >(event => {
        const { value } = event.target;
        onSearchChange(value);
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const onInputKeyDown = useConstCallback((event: { key: string }) => {
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

        onKeyPress?.(key);

        switch (key) {
            case "Enter":
                if (search === "") {
                    setIsActive(false);
                }
                break;
            case "Escape":
                onSearchChange("");
                setIsActive(false);
                break;
        }

        inputRef.current?.blur();
    });

    const { rootRef } = useClickAway(() => {
        if (search !== "") return;
        setIsActive(false);
    });

    useEvt(
        ctx =>
            evtAction?.attach(
                action => action === "CLEAR SEARCH",
                ctx,
                () => onInputKeyDown({ "key": "Escape" }),
            ),
        [evtAction ?? Object],
    );

    return (
        <div
            ref={rootRef}
            className={cx(classes.root, className)}
            onClick={onRootClick}
        >
            <div>
                <Icon
                    iconId="search"
                    onClick={onIconClick}
                    className={classes.icon}
                />
                {isActive ? (
                    <>
                        <input
                            ref={inputRef}
                            autoFocus={true}
                            className={classes.input}
                            type="text"
                            value={search}
                            onChange={onInputChange}
                            onKeyDown={onInputKeyDown}
                            spellCheck={false}
                            placeholder={placeholder}
                        />
                        {
                            <IconButton
                                iconId="cancel"
                                size="small"
                                disabled={search === ""}
                                onClick={onClearButtonClick}
                            />
                        }
                    </>
                ) : (
                    <span className={classes.searchLabel}>{placeholder}</span>
                )}
            </div>
        </div>
    );
});

const useStyles = makeStyles<{ isActive: boolean }>({
    "name": { SearchBar },
})((theme, { isActive }) => ({
    "root": {
        "borderRadius": 8,
        "overflow": "hidden",
        "boxShadow": theme.shadows[1],
        "& > div": {
            "display": "flex",
            "alignItems": "center",
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "cursor": isActive ? undefined : "pointer",
            "overflow": "hidden",
            "border": "solid 2px transparent",
            "&:hover": {
                "borderBottomColor": theme.colors.useCases.buttons.actionActive,
            },
        },
    },
    "input": {
        "flex": 1,
        "caretColor": theme.colors.useCases.typography.textFocus,
        ...theme.typography.variants["body 1"].style,
        "outline": "none",
        "borderWidth": 0,
        "border": "none",
        "backgroundColor": "transparent",
        "color": theme.colors.useCases.typography.textPrimary,
        "&::placeholder": {
            "color": theme.colors.useCases.typography.textDisabled,
            "opacity": 1,
        },
    },
    "icon": {
        "margin": `${theme.spacing(2) - 2}px ${theme.spacing(3) - 2}px`,
        "color": isActive
            ? theme.colors.useCases.typography.textFocus
            : undefined,
    },
    "searchLabel": {
        ...(theme.muiTheme.typography.button as any),
        "display": "block",
        "flex": 1,
        "color": theme.colors.useCases.typography.textPrimary,
    },
}));
