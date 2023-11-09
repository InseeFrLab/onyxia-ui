import "minimal-polyfills/Object.fromEntries";
import { memo } from "react";
import { tss } from "./lib/tss";
import { keyframes } from "tss-react";
import { symToStr } from "tsafe/symToStr";
import { ThemedSvg } from "./ThemedSvg";

type Props = {
    className: string;
    svgUrl: string;
};

export const AnimatedLogo = memo((props: Props) => {
    const { className, svgUrl } = props;

    const { cx, classes } = useStyles();

    return (
        <ThemedSvg className={cx(classes.root, className)} svgUrl={svgUrl} />
    );
});

AnimatedLogo.displayName = symToStr({ AnimatedLogo });

const useStyles = tss.withName({ AnimatedLogo }).create(() => {
    const animation = `${keyframes`
                            0% {
                                opacity: 0;
                            }
                            40% {
                                opacity: 1;
                            }
                            60%, 100% {
                                opacity: 0;
                            }
                            `} 3.5s infinite ease-in-out`;

    return {
        "root": {
            "border": "1px solid red",

            ...Object.fromEntries(
                [
                    ["animation-group1", ".4"],
                    ["animation-group2", ".8"],
                    ["animation-group3", "1.2"],
                ].map(([className, delaySecond]) => [
                    `.${className}`,
                    {
                        "opacity": 0,
                        animation,
                        "animationDelay": `${delaySecond}s`,
                    },
                ]),
            ),
        },
    };
});

export const createAnimatedLogo = (svgUrl: string) => {
    const AnimatedLogoWithUrl = (props: Omit<Props, "svgUrl">) => (
        <AnimatedLogo svgUrl={svgUrl} {...props} />
    );

    AnimatedLogoWithUrl.displayName = AnimatedLogo.displayName;

    return AnimatedLogoWithUrl;
};
