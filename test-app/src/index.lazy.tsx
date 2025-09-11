import { createRoot } from "react-dom/client";
import { OnyxiaUi } from "./theme";
import { useEffect, Suspense, lazy } from "react";
import { useSplashScreen } from "onyxia-ui";
import { SuspenseFallback } from "./SuspenseFallback";

const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
    <OnyxiaUi>
        <Root />
    </OnyxiaUi>,
);

function Root() {
    const { hideRootSplashScreen } = useSplashScreen();

    useEffect(() => {
        hideRootSplashScreen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Suspense fallback={<SuspenseFallback />}>
            <App />
        </Suspense>
    );
}
