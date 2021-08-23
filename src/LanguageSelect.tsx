import { useState, memo } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { makeStyles } from "./lib/ThemeProvider";
import { createIcon } from "./Icon";
import { Text } from "./Text/TextBase";
import { useDomRect } from "powerhooks/useDomRect";
import { Tooltip } from "./Tooltip";
import MuiButton from "@material-ui/core/Button";
import type { ButtonProps as MuiButtonProps } from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { objectKeys } from "tsafe/objectKeys";
import PublicIcon from "@material-ui/icons/Public";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export type LanguageSelectProps<Language extends string = string> = {
    className?: string;
    doShowIcon?: boolean;
    variant: "for footer" | "for header";
    /** Example "en" or "fr" */
    language: Language;
    onLanguageChange(language: Language): void;
    /** If provided a tooltip will show up on hover with this text */
    selectLanguageText?: string;
};

const { Icon } = createIcon({
    "public": PublicIcon,
    "expandMore": ExpandMoreIcon,
});

const menuId = "language-menu";

export function createLanguageSelect<Language extends string>(params: {
    /** Example { "en": "English", "fr": "Français" } */
    languagesPrettyPrint: Record<Language, string>;
}) {
    const { languagesPrettyPrint } = params;

    const useStyles = makeStyles<{
        buttonWidth: number;
        variant: LanguageSelectProps["variant"];
    }>()((theme, { buttonWidth, variant }) => ({
        "button": {
            ...(() => {
                switch (variant) {
                    case "for header":
                        return {};
                    case "for footer":
                        return {
                            "padding": 0,
                        };
                }
            })(),
        },
        "menu": {
            "& .Mui-selected": {
                "backgroundColor": theme.colors.useCases.surfaces.surface1,
            },
            "& .MuiPaper-root": {
                "backgroundColor": theme.colors.useCases.surfaces.background,
                "width": buttonWidth,
            },
            "& a": {
                "color": theme.colors.useCases.typography.textPrimary,
            },
        },
        "icon": {
            "color": theme.colors.useCases.typography.textPrimary,
            ...(() => {
                switch (variant) {
                    case "for header":
                        return {};
                    case "for footer":
                        return {
                            "transform": "rotate(-180deg)",
                        };
                }
            })(),
        },
    }));

    const LanguageSelect = memo((props: LanguageSelectProps<Language>) => {
        const {
            className,
            doShowIcon = true,
            variant,
            selectLanguageText,
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

        const onMenuItemClickFactory = useCallbackFactory(
            ([lng]: [Language]) => {
                onLanguageChange(lng);
                onMenuClose();
            },
        );

        return (
            <>
                <Tooltip title={selectLanguageText} enterDelay={300}>
                    <MuiButton
                        className={cx(classes.button, className)}
                        ref={buttonRef}
                        aria-owns={languageMenu ? menuId : undefined}
                        aria-haspopup="true"
                        aria-label={selectLanguageText ?? "change language"}
                        onClick={onClick}
                        data-ga-event-category="header"
                        data-ga-event-action="language"
                    >
                        {doShowIcon && (
                            <Icon iconId="public" className={classes.icon} />
                        )}
                        <Text
                            typo="label 1"
                            className={css({
                                "marginLeft": theme.spacing(2),
                                "textTransform": "capitalize",
                            })}
                        >
                            {languagesPrettyPrint[language]}
                        </Text>
                        <Icon className={classes.icon} iconId="expandMore" />
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
                                onClick={onMenuItemClickFactory(
                                    supportedLanguage,
                                )}
                                lang={supportedLanguage}
                            >
                                {languagesPrettyPrint[supportedLanguage]}
                            </MenuItem>
                        ))}
                </Menu>
            </>
        );
    });

    return { LanguageSelect };
}
