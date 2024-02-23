import { ThemedSvg, useThemedSvgAsBlobUrl } from "./ThemedSvg";
import {
    type ThemedAssetUrl,
    useResolveThemedAssetUrl,
} from "./lib/ThemedAssetUrl";

type Props = {
    className?: string;
    url: ThemedAssetUrl;
    alt?: string;
};

function getIsSvg(url: string) {
    return (
        url.split("?")[0].endsWith(".svg") || url.startsWith("data:image/svg")
    );
}

export function ThemedImage(props: Props) {
    const { className, alt = "" } = props;

    const { resolveThemedAssetUrl } = useResolveThemedAssetUrl();

    const url = resolveThemedAssetUrl(props.url);

    return getIsSvg(url) ? (
        <ThemedSvg svgUrl={url} className={className} />
    ) : (
        <img src={url} alt={alt} className={className} />
    );
}

export function useThemedImageUrl(
    themedAssetUrl: ThemedAssetUrl | undefined,
): string | undefined {
    const { resolveThemedAssetUrl } = useResolveThemedAssetUrl();

    const url =
        themedAssetUrl === undefined
            ? undefined
            : resolveThemedAssetUrl(themedAssetUrl);

    const svgDataUrl = useThemedSvgAsBlobUrl(
        url === undefined ? undefined : getIsSvg(url) ? url : undefined,
    );

    return url === undefined ? undefined : getIsSvg(url) ? svgDataUrl : url;
}
