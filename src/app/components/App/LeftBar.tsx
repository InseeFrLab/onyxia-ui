
import { useMemo, memo } from "react";
import { Icon } from "app/theme";
import { Typography } from "onyxia-ui";
import { createUseClassNames, useTheme } from "app/theme";
import { cx } from "tss-react";
import { useTranslation } from "app/i18n/useTranslations";
import { createUseGlobalState, useCallbackFactory } from "powerhooks";
import { routes } from "app/routes/router";
import { doExtends } from "tsafe/doExtends";
import Divider from "@material-ui/core/Divider";
import type { IconId } from "app/theme";

const targets = [
    "toggle isExpanded" as const,
    ...(() => {

        const pageTarget = [
            "home",
            "account",
            "trainings",
            "sharedServices",
            "catalogExplorer",
            "myServices",
            "mySecrets",
            "myBuckets"
        ] as const;

        doExtends<typeof pageTarget[number], keyof typeof routes>();

        return pageTarget;

    })()
];

export type Target = typeof targets[number];

export type Props = {
    className?: string;
    collapsedWidth: number;
    currentPage: keyof typeof routes | false;
    onClick(target: Exclude<Target, "toggle isExpanded">): void;
};

const { useClassNames } = createUseClassNames<Props>()(
    theme => ({
        "root": {
            "paddingBottom": theme.spacing(2),
            "overflow": "visible"
        },
        "nav": {
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
            "borderRadius": 16,
            "boxShadow": theme.shadows[3],
            "paddingTop": theme.spacing(1),
            "marginLeft": theme.spacing(2),
            "marginRight": theme.spacing(2),
            "overflow": "auto",
            "height": "100%"
        }
    })
);

const { useIsExpanded } = createUseGlobalState("isExpanded", false);


export const LeftBar = memo((props: Props) => {

    const {
        collapsedWidth,
        onClick,
        className,
        currentPage
    } = props;

    const { isExpanded, setIsExpanded } = useIsExpanded();

    const onClickFactory = useCallbackFactory(
        ([target]: [Target]) => {

            if (target === "toggle isExpanded") {
                setIsExpanded(isExpanded => !isExpanded);
                return;
            }

            onClick(target)

        }
    );

    const { classNames } = useClassNames(props);

    const theme = useTheme();

    return (
        <section className={cx(classNames.root, className)}>
            <nav className={cx(classNames.nav)} >
                {
                    targets.map(
                        target =>
                            <CustomButton
                                key={target}
                                isActive={
                                    currentPage === target ||
                                    (currentPage === "myFiles" && target === "myBuckets")
                                }
                                target={target}
                                isExpanded={isExpanded}
                                collapsedWidth={collapsedWidth - theme.spacing(4)}
                                hasDivider={(() => {
                                    switch (target) {
                                        case "account":
                                        case "sharedServices":
                                        case "myServices":
                                            return true;
                                        default:
                                            return false;
                                    }
                                })()}
                                onClick={onClickFactory(target)}
                            />
                    )
                }
            </nav>
        </section>
    );

});

export declare namespace LeftBar {
    export type I18nScheme = Record<
        Target,
        undefined
    >;
}

const { CustomButton } = (() => {

    type Props = {
        target: Exclude<Target, "toggle expand">;
        isExpanded: boolean;
        collapsedWidth: number;
        isActive: boolean;
        hasDivider: boolean;
        onClick(): void;
    };

    const hoverBoxClassName = "hoverBox";

    const { useClassNames } = createUseClassNames<Props>()(
        (theme, { collapsedWidth, isExpanded, target, isActive }) => ({
            "root": {
                "display": "flex",
                "cursor": "pointer",
                "marginTop": theme.spacing(1),
                [`&:hover .${hoverBoxClassName}`]: {
                    "backgroundColor": theme.colors.useCases.surfaces.background,
                },
                [
                    [".MuiSvgIcon-root", ".MuiTypography-root"]
                        .map(name => `&${!isActive ? ":active" : ""} ${name}`)
                        .join(", ")
                ]: {
                    "color": theme.colors.useCases.typography.textFocus
                }
            },
            "iconWrapper": {
                "width": collapsedWidth,
                "textAlign": "center",
                "position": "relative",
            },
            "iconHoverBox": {
                "display": "inline-block",
                "position": "absolute",
                "height": "100%",
                "left": collapsedWidth * 1 / 8,
                "right": isExpanded ? 0 : collapsedWidth * 1 / 8,
                "zIndex": 1,
                "borderRadius": `10px ${isExpanded ? "0 0" : "10px 10px"} 10px`,
            },
            "icon": {
                "position": "relative",
                "zIndex": 2,
                "margin": theme.spacing(1, 0),
                ...(target !== "toggle isExpanded" ? {} : {
                    "transform": isExpanded ? "rotate(0)" : "rotate(-180deg)"
                })
            },
            "typoWrapper": {
                "paddingRight": theme.spacing(1),
                "flex": 1,
                "borderRadius": "0 10px 10px 0",
                "display": "flex",
                "alignItems": "center",
                "marginRight": theme.spacing(4)
            },
            "divider": {
                "marginTop": theme.spacing(1),
                "backgroundColor": theme.colors.useCases.typography.textTertiary
            }
        })
    );

    const CustomButton = memo((props: Props) => {

        const { isExpanded, target, hasDivider, onClick } = props;

        const { t } = useTranslation("LeftBar");

        const type = useMemo((): IconId => {
            switch (target) {
                case "home": return "home";
                case "account": return "account";
                case "catalogExplorer": return "catalog";
                case "myBuckets": return "files";
                case "mySecrets": return "secrets";
                case "myServices": return "services";
                case "sharedServices": return "community";
                case "toggle isExpanded": return "chevronLeft";
                case "trainings": return "trainings";
            }
        }, [target]);

        const { classNames } = useClassNames(props);

        return (
            <>
                <div
                    className={classNames.root}
                    onClick={onClick}
                >
                    <div className={classNames.iconWrapper} >

                        <div className={cx(hoverBoxClassName, classNames.iconHoverBox)} />

                        <Icon
                            id={type}
                            className={classNames.icon}
                            fontSize="large"
                        />

                    </div>
                    {
                        !isExpanded ?
                            null
                            :
                            <div className={cx(hoverBoxClassName, classNames.typoWrapper)} >
                                <Typography variant="h6">
                                    {t(target)}
                                </Typography>
                            </div>

                    }
                </div>
                {
                    hasDivider &&
                    <Divider
                        key={target + "divider"}
                        className={classNames.divider}
                        variant="middle"
                    />
                }
            </>
        );

    });

    return { CustomButton };

})();
