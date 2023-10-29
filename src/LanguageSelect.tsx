import { useState } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { tss } from "./lib/tss";
import { Text } from "./Text";
import { useDomRect } from "powerhooks/useDomRect";
import { Tooltip } from "./Tooltip";
import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { objectKeys } from "tsafe/objectKeys";
import type { MuiIconsComponentName } from "./MuiIconsComponentName";
import { id } from "tsafe/id";
import { Icon } from "./Icon";

export type LanguageSelectProps<Language extends string> = {
    className?: string;
    /** Example { "en": "English", "fr": "Français" } */
    languagesPrettyPrint: Record<Language, string>;
    doShowIcon?: boolean;
    variant: "small" | "big";
    /** Example "en" or "fr" */
    language: Language;
    onLanguageChange: (language: Language) => void;
    /** If provided a tooltip will show up on hover with this text */
    changeLanguageText?: string;
};

const menuId = "language-menu";

export function LanguageSelect<Language extends string>(
    props: LanguageSelectProps<Language>,
) {
    const {
        className,
        languagesPrettyPrint,
        doShowIcon = true,
        variant,
        changeLanguageText,
        language,
        onLanguageChange,
    } = props;

    const {
        ref: buttonRef,
        domRect: { width: buttonWidth },
    } = useDomRect();

    const { classes, theme, cx, css } = useStyles({ buttonWidth, variant });

    const [languageMenu, setLanguageMenu] = useState<
        HTMLButtonElement | undefined
    >(undefined);

    const onClick = useConstCallback<MuiButtonProps["onClick"]>(event =>
        setLanguageMenu(event.currentTarget),
    );

    const onMenuClose = useConstCallback(() => setLanguageMenu(undefined));

    const onMenuItemClickFactory = useCallbackFactory(([lng]: [Language]) => {
        onLanguageChange(lng);
        onMenuClose();
    });

    return (
        <>
            <Tooltip title={changeLanguageText} enterDelay={300}>
                <MuiButton
                    className={cx(classes.button, className)}
                    ref={buttonRef}
                    aria-owns={languageMenu !== undefined ? menuId : undefined}
                    aria-haspopup="true"
                    aria-label={changeLanguageText ?? "change language"}
                    onClick={onClick}
                    data-ga-event-category="header"
                    data-ga-event-action="language"
                >
                    {doShowIcon && (
                        <Icon
                            iconId={id<MuiIconsComponentName>("Public")}
                            className={classes.icon}
                            size={(() => {
                                switch (variant) {
                                    case "big":
                                        return "default";
                                    case "small":
                                        return "extra small";
                                }
                            })()}
                        />
                    )}
                    <Text
                        typo={(() => {
                            switch (variant) {
                                case "big":
                                    return "label 1";
                                case "small":
                                    return "body 2";
                            }
                        })()}
                        className={css({
                            "marginLeft": theme.spacing(2),
                            "textTransform": "capitalize",
                        })}
                    >
                        {languagesPrettyPrint[language]}
                    </Text>
                    {variant === "big" && (
                        <Icon
                            className={classes.icon}
                            iconId={id<MuiIconsComponentName>("ExpandMore")}
                        />
                    )}
                </MuiButton>
            </Tooltip>
            <Menu
                id={menuId}
                anchorEl={languageMenu}
                open={languageMenu !== undefined}
                className={classes.menu}
                onClose={onMenuClose}
            >
                {objectKeys(languagesPrettyPrint)
                    .sort((a, b) =>
                        a === language ? -1 : b === language ? 1 : 0,
                    )
                    .map(supportedLanguage => (
                        <MenuItem
                            component="a"
                            data-no-link="true"
                            key={supportedLanguage}
                            selected={language === supportedLanguage}
                            onClick={onMenuItemClickFactory(supportedLanguage)}
                            lang={supportedLanguage}
                        >
                            {languagesPrettyPrint[supportedLanguage]}
                        </MenuItem>
                    ))}
            </Menu>
        </>
    );
}

const useStyles = tss
    .withParams<{
        buttonWidth: number;
        variant: LanguageSelectProps<any>["variant"];
    }>()
    .withName({ LanguageSelect })
    .create(({ theme, buttonWidth, variant }) => ({
        "button": {
            "padding": (() => {
                switch (variant) {
                    case "big":
                        return undefined;
                    case "small":
                        return 0;
                }
            })(),
        },
        "menu": {
            "& .Mui-selected": {
                "backgroundColor": theme.colors.useCases.surfaces.surface1,
            },
            "& .MuiPaper-root": {
                "backgroundColor": theme.colors.useCases.surfaces.background,
                "width": (() => {
                    switch (variant) {
                        case "big":
                            return buttonWidth;
                        case "small":
                            return undefined;
                    }
                })(),
            },
            "& a": {
                "color": theme.colors.useCases.typography.textPrimary,
            },
        },
        "icon": {
            "color": theme.colors.useCases.typography.textPrimary,
        },
    }));
