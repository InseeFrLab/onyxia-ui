import { memo, ReactNode } from "react";
import { tss } from "./lib/tss";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { ButtonBarButton } from "./ButtonBarButton";
import { symToStr } from "tsafe/symToStr";

export type ButtonBarProps<ButtonId extends string = never> = {
    className?: string;
    buttons: readonly {
        buttonId: ButtonId;
        icon: string;
        label: ReactNode;
        isDisabled?: boolean;
        link?: {
            href: string;
            onClick?: (event?: any) => void;
            target?: "_blank";
        };
    }[];
    onClick: (buttonId: ButtonId) => void;
};

function NonMemoizedButtonBar<ButtonId extends string>(
    props: ButtonBarProps<ButtonId>,
) {
    const { className, buttons, onClick } = props;

    const { classes, cx } = useStyles();

    const onClickFactory = useCallbackFactory(([buttonId]: [ButtonId]) =>
        onClick(buttonId),
    );

    return (
        <div className={cx(classes.root, className)}>
            {buttons.map(
                ({ buttonId, icon, isDisabled = false, label, link }) => (
                    <ButtonBarButton
                        startIcon={icon}
                        disabled={isDisabled}
                        key={buttonId}
                        {...(link === undefined
                            ? {
                                  "onClick": onClickFactory(buttonId),
                              }
                            : {
                                  "href": link.href,
                                  "onClick": event => {
                                      const out = link.onClick?.(event);

                                      onClickFactory(buttonId)();

                                      return out;
                                  },
                                  "doOpenNewTabIfHref":
                                      link.target === "_blank",
                              })}
                    >
                        {label}
                    </ButtonBarButton>
                ),
            )}
        </div>
    );
}

export const ButtonBar = memo(NonMemoizedButtonBar) as <
    ButtonId extends string = never,
>(
    props: ButtonBarProps<ButtonId>,
) => ReturnType<typeof NonMemoizedButtonBar>;

(ButtonBar as any).displayName = symToStr({ ButtonBar });

const useStyles = tss.withName({ ButtonBar }).create(({ theme }) => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "boxShadow": theme.shadows[1],
        "borderRadius": 8,
        "overflow": "hidden",
    },
}));
