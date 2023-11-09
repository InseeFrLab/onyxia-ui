import { useMemo } from "react";
import { useIsDarkModeEnabled } from "./useIsDarkModeEnabled";

/**
 * ThemedAssetUrl is a type that enable Onyxia administrators to provide a different asset url
 * depending on the user's dark mode preference.
 * If you don't need this level of customization, you can simply provide a string.
 *
 * Examples with the FAVICON environment variable:
 *
 * FAVICON: "https://example.com/favicon.svg"
 *
 * FAVICON: |
 *     {
 *         "light": "https://user-images.githubusercontent.com/6702424/280081114-85e465c0-34a2-47f4-8c38-6d5a5eba31c4.svg",
 *         "dark": "https://example.com/favicon-dark.svg",
 *     }
 */
export type ThemedAssetUrl =
    | string
    | {
          light: string;
          dark: string;
      };

export function resolveAssetVariantUrl(params: {
    isDarkModeEnabled: boolean;
    themedAssetUrl: ThemedAssetUrl;
}): string {
    const { isDarkModeEnabled, themedAssetUrl } = params;

    if (typeof themedAssetUrl === "string") {
        return themedAssetUrl;
    }

    return isDarkModeEnabled ? themedAssetUrl.dark : themedAssetUrl.light;
}

export function useResolveAssetVariantUrl(themedAssetUrl: ThemedAssetUrl) {
    const { isDarkModeEnabled } = useIsDarkModeEnabled();

    const url = useMemo(
        () =>
            resolveAssetVariantUrl({
                isDarkModeEnabled,
                themedAssetUrl,
            }),
        [isDarkModeEnabled, themedAssetUrl],
    );

    return url;
}
