import { memo, ReactNode } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { ButtonBarButton } from "./ButtonBarButton";
import { symToStr } from "tsafe/symToStr";
import { BaseBar } from "./BaseBar";
import type { IconProps } from "./Icon";

export type ButtonBarProps<ButtonId extends string = never> = {
    className?: string;
    buttons: Readonly<ButtonBarProps.Button<ButtonId>[]>;
    onClick: (buttonId: ButtonId) => void;
};

export namespace ButtonBarProps {
    export type Button<ButtonId extends string> =
        | Button.Callback<ButtonId>
        | Button.Link;

    export namespace Button {
        type Common = {
            icon: IconProps.Icon;
            label: ReactNode;
            isDisabled?: boolean;
        };

        export type Callback<ButtonId extends string> = Common & {
            buttonId: ButtonId;
        };

        export type Link = Common & {
            link: {
                href: string;
                onClick?: (event?: any) => void;
                target?: "_blank";
            };
        };
    }
}

function NonMemoizedButtonBar<ButtonId extends string>(
    props: ButtonBarProps<ButtonId>,
) {
    const { className, buttons, onClick } = props;

    const onClickFactory = useCallbackFactory(([buttonId]: [ButtonId]) =>
        onClick(buttonId),
    );

    return (
        <BaseBar className={className}>
            {buttons.map(button => (
                <ButtonBarButton
                    startIcon={button.icon}
                    disabled={button.isDisabled ?? false}
                    key={"link" in button ? button.link.href : button.buttonId}
                    {...("link" in button
                        ? {
                              href: button.link.href,
                              onClick: button.link.onClick,
                              doOpenNewTabIfHref:
                                  button.link.target === "_blank",
                          }
                        : {
                              onClick: onClickFactory(button.buttonId),
                          })}
                >
                    {button.label}
                </ButtonBarButton>
            ))}
        </BaseBar>
    );
}

export const ButtonBar = memo(NonMemoizedButtonBar) as <
    ButtonId extends string = never,
>(
    props: ButtonBarProps<ButtonId>,
) => ReturnType<typeof NonMemoizedButtonBar>;

(ButtonBar as any).displayName = symToStr({ ButtonBar });
