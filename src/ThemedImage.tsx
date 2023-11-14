import { ThemedSvg } from "./ThemedSvg";
import {
    type ThemedAssetUrl,
    useResolveThemedAsset,
} from "./lib/ThemedAssetUrl";

type Props = {
    className?: string;
    url: ThemedAssetUrl;
    alt?: string;
};

export function ThemedImage(props: Props) {
    const { className, alt = "" } = props;

    const { resolveThemedAsset } = useResolveThemedAsset();

    const url = resolveThemedAsset(props.url);

    return url.endsWith(".svg") ? (
        <ThemedSvg svgUrl={url} className={className} />
    ) : (
        <img src={url} alt={alt} className={className} />
    );
}
