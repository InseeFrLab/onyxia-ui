export function getSafeUrl(url: string) {
    if (url.startsWith("file://")) {
        return url;
    }

    if (url.startsWith("data:")) {
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

    try {
        new URL(unsafeUrl).href;
    } catch {
        throw new Error(`The url ${url} is not valid`);
    }

    return toReturn;
}
