import { useRef, useState, forwardRef, useEffect, memo } from "react";
import type { ChangeEventHandler } from "react";
import { tss } from "./lib/tss";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useClickAway } from "powerhooks/useClickAway";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useMergeRefs } from "powerhooks/useMergeRefs";
import type { NonPostableEvtLike } from "evt";
import { useNonPostableEvtLike } from "./tools/useNonPostableEvtLike";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { useConst } from "powerhooks/useConst";

export type SearchBarProps = {
    className?: string;
    search: string;
    onSearchChange: (search: string) => void;
    evtAction?: NonPostableEvtLike<"CLEAR SEARCH">;
    /** Default "Search" */
    placeholder?: string;
    classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
    restorableSearch?: string;
    onKeyPress?: (key: "Enter" | "Escape") => void;
};

export const SearchBar = memo(
    forwardRef<any, SearchBarProps>((props, forwardedRef) => {
        const {
            className,
            onSearchChange: onSearchChange_params,
            search,
            placeholder = "Search",
            evtAction: evtActionLike,
            restorableSearch,
            onKeyPress,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            classes: props_classes,
            ...rest
        } = props;

        const restorableSearchRef = useConst(() => ({
            "current": restorableSearch,
        }));

        restorableSearchRef.current = restorableSearch;

        const onSearchChange = useConstCallback(onSearchChange_params);

        const evtAction = useNonPostableEvtLike(evtActionLike);

        //For the forwarding, rest should be empty (typewise),
        // eslint-disable-next-line @typescript-eslint/ban-types
        assert<Equals<typeof rest, {}>>();

        const [isActive, setIsActive] = useState(search !== "");

        useEffect(() => {
            if (search !== "") {
                setIsActive(true);
            }
        }, [search]);

        const onClearButtonClick = useConstCallback(() => {
            onSearchChange("");

            if (restorableSearch === undefined) {
                setIsActive(false);
                inputRef.current?.blur();
            } else {
                inputRef.current?.focus();
            }
        });
        const onRootClick = useConstCallback(() => {
            if (!isActive) {
                setIsActive(true);
            }
        });
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

        const isComponentActiveRef = useConst(() => ({ "current": true }));

        useEffect(() => {
            isComponentActiveRef.current = true;

            return () => {
                isComponentActiveRef.current = false;
            };
        }, []);

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

            switch (key) {
                case "Enter":
                    if (search === "") {
                        setIsActive(false);
                    }
                    break;
                case "Escape":
                    if (restorableSearch === undefined) {
                        onSearchChange("");
                        setIsActive(false);
                    } else {
                        onSearchChange(restorableSearch);
                    }

                    break;
            }

            inputRef.current?.blur();

            (async () => {
                await new Promise(resolve => setTimeout(resolve, 50));

                if (!isComponentActiveRef.current) {
                    return;
                }

                onKeyPress?.(key);
            })();
        });

        const { ref: rootRefClickAway } = useClickAway({
            "onClickAway": () => {
                if (restorableSearch === undefined) {
                    if (search !== "") {
                        return;
                    }
                    setIsActive(false);
                } else {
                    (async () => {
                        await new Promise(resolve => setTimeout(resolve, 200));

                        if (!isComponentActiveRef.current) {
                            return;
                        }

                        assert(restorableSearchRef.current !== undefined);

                        onSearchChange(restorableSearchRef.current);
                    })();
                }
            },
        });

        const rootRef = useMergeRefs([rootRefClickAway, forwardedRef]);

        useEvt(
            ctx =>
                evtAction?.attach(
                    action => action === "CLEAR SEARCH",
                    ctx,
                    () => {
                        if (restorableSearchRef.current !== undefined) {
                            onSearchChange(restorableSearchRef.current);
                        } else {
                            onSearchChange("");
                            setIsActive(false);
                        }

                        inputRef.current?.blur();
                    },
                ),
            [evtAction],
        );

        const { classes, cx } = useStyles({
            isActive,
            "classesOverrides": props_classes,
        });

        return (
            <div
                ref={rootRef}
                className={cx(classes.root, className)}
                onClick={onRootClick}
            >
                <div>
                    <Icon
                        icon={SearchIcon}
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
                            <IconButton
                                icon={CancelIcon}
                                size="small"
                                disabled={search === ""}
                                onClick={onClearButtonClick}
                            />
                        </>
                    ) : (
                        <span className={classes.searchLabel}>
                            {placeholder}
                        </span>
                    )}
                </div>
            </div>
        );
    }),
);

const useStyles = tss
    .withName({ SearchBar })
    .withParams<{ isActive: boolean }>()
    .create(({ theme, isActive }) => ({
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
                    "borderBottomColor":
                        theme.colors.useCases.buttons.actionActive,
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
