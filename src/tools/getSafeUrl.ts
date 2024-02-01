export function getSafeUrl(url: string) {
    let unsafeUrl = url;
    let toReturn = url;

    if (url.startsWith("/")) {
        unsafeUrl = `${window.location.origin}${url}`;
    } else if (!/^[^a-zA-Z0-9]+:\/\//.test(url)) {
        unsafeUrl = `https://${url}`;
        toReturn = unsafeUrl;
    }

    //Trow if unsafeUrl is not a valid url
    new URL(unsafeUrl).href;

    return toReturn;
}
