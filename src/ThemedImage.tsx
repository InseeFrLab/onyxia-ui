import { ThemedSvg } from "./ThemedSvg";
import {
    type ThemedAssetUrl,
    useResolveAssetVariantUrl,
} from "./lib/ThemedAssetUrl";

type Props = {
    className?: string;
    url: ThemedAssetUrl;
    alt?: string;
};

export function ThemedImage(props: Props) {
    const { className, alt = "" } = props;

    const url = useResolveAssetVariantUrl(props.url);

    return url.endsWith(".svg") ? (
        <ThemedSvg svgUrl={url} className={className} />
    ) : (
        <img src={url} alt={alt} className={className} />
    );
}
