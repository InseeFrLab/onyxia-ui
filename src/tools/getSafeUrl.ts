export function getSafeUrl(url: string) {
    if (url.startsWith("file://")) {
        return url;
    }

    let unsafeUrl = url;
    let toReturn = url;

    if (url.startsWith("/")) {
        unsafeUrl = `${window.location.origin}${url}`;
    } else if (!url.startsWith("http")) {
        unsafeUrl = `https://${url}`;
        toReturn = unsafeUrl;
    }

    //Trow if unsafeUrl is not a valid url
    new URL(unsafeUrl).href;

    return toReturn;
}
