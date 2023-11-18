import { useContext, createContext } from "react";

export const baseUrlContext = createContext<string | undefined>(undefined);

/**
 * For consistency the returned value is in the default Vite format.
 * (i.e. it starts with a "/" and ends with a "/")
 *
 * "https://my-domain.com/my-app/" => "/my-app/"
 * "https://my-domain.com/" => "/"
 *
 */
export function useViteStyleBaseUrl() {
    const contextValue = useContext(baseUrlContext);

    if (contextValue === undefined) {
        throw new Error("Your app should be wrapped into OnyxiaUi");
    }

    const BASE_URL = contextValue.replace(/\/?$/, "/");

    return { BASE_URL };
}
