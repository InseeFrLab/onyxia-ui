import { useEffect } from "react";
import { useSplashScreen } from "onyxia-ui";

export function SuspenseFallback() {
    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        showSplashScreen({ enableTransparency: true });
        return () => {
            hideSplashScreen();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
