import type { FC } from "react";
import { memo } from "react";
import { makeStyles } from "./lib/ThemeProvider";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import type { IconProps } from "./Icon";
import { createButtonBarButton } from "./ButtonBarButton";

export type ButtonBarProps<
    ButtonId extends string = never,
    IconId extends string = never,
> = {
    className?: string;
    buttons: readonly {
        buttonId: ButtonId;
        icon: IconId;
        label: string;
        isDisabled: boolean;
    }[];
    onClick(buttonId: ButtonId): void;
};

export function createButtonBar<IconId extends string = never>(params: {
    Icon(props: IconProps<IconId>): ReturnType<FC>;
}) {
    const { Icon } = params;

    const { ButtonBarButton } = createButtonBarButton({ Icon });

    const ButtonBar = memo(
        <ButtonId extends string>(props: ButtonBarProps<ButtonId, IconId>) => {
            const { className, buttons, onClick } = props;

            const { classes, cx } = useStyles();

            const onClickFactory = useCallbackFactory(
                ([buttonId]: [ButtonId]) => onClick(buttonId),
            );

            return (
                <div className={cx(classes.root, className)}>
                    {buttons.map(({ buttonId, icon, isDisabled, label }) => (
                        <ButtonBarButton
                            startIcon={icon}
                            disabled={isDisabled}
                            key={buttonId}
                            onClick={onClickFactory(buttonId)}
                        >
                            {label}
                        </ButtonBarButton>
                    ))}
                </div>
            );
        },
    );

    const useStyles = makeStyles({ "label": { ButtonBar } })(theme => ({
        "root": {
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "boxShadow": theme.shadows[1],
            "borderRadius": 8,
            "overflow": "hidden",
        },
    }));

    return { ButtonBar };
}
