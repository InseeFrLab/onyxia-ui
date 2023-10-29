import { memo } from "react";
import { tss } from "./lib/tss";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { ButtonBarButton } from "./ButtonBarButton";
import { symToStr } from "tsafe/symToStr";

export type ButtonBarProps<ButtonId extends string = never> = {
    className?: string;
    buttons: readonly {
        buttonId: ButtonId;
        icon: string;
        label: string;
        isDisabled: boolean;
    }[];
    onClick(buttonId: ButtonId): void;
};

export const ButtonBar = memo(
    <ButtonId extends string>(props: ButtonBarProps<ButtonId>) => {
        const { className, buttons, onClick } = props;

        const { classes, cx } = useStyles();

        const onClickFactory = useCallbackFactory(([buttonId]: [ButtonId]) =>
            onClick(buttonId),
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

ButtonBar.displayName = symToStr({ ButtonBar });

const useStyles = tss.withName({ ButtonBar }).create(({ theme }) => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "boxShadow": theme.shadows[1],
        "borderRadius": 8,
        "overflow": "hidden",
    },
}));
