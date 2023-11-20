import { ThemedSvg } from "./ThemedSvg";
import {
    type ThemedAssetUrl,
    useResolveThemedAssetUrl,
} from "./lib/ThemedAssetUrl";
import { getSafeUrl } from "./tools/getSafeUrl";

type Props = {
    className?: string;
    url: ThemedAssetUrl;
    alt?: string;
};

export function ThemedImage(props: Props) {
    const { className, alt = "" } = props;

    const { resolveThemedAssetUrl } = useResolveThemedAssetUrl();

    const url = resolveThemedAssetUrl(props.url);

    return url.endsWith(".svg") ? (
        <ThemedSvg svgUrl={url} className={className} />
    ) : (
        <img src={getSafeUrl(url)} alt={alt} className={className} />
    );
}
