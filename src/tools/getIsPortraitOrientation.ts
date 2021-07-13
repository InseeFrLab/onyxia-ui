export function getIsPortraitOrientation(props: {
    windowInnerWidth: number;
    windowInnerHeight: number;
}) {
    const { windowInnerWidth, windowInnerHeight } = props;

    const isMobileInPortraitOrientation =
        windowInnerWidth / windowInnerHeight < 1 / 1.3;

    return isMobileInPortraitOrientation;
}
