import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { Text, splashScreen } from "./theme";
import { getIsPortraitOrientation, ViewPortOutOfRangeError } from "onyxia-ui";
import type { ThemeProviderProps } from "onyxia-ui";
import { createRoot } from "react-dom/client";



const getViewPortConfig: ThemeProviderProps["getViewPortConfig"] =
    ({ windowInnerWidth, windowInnerHeight, browserFontSizeFactor }) => {
        if (getIsPortraitOrientation({ windowInnerWidth, windowInnerHeight })) {
            throw new ViewPortOutOfRangeError(<Text typo="my hero">Rotate your screen</Text>);
        }
        return {
            "targetWindowInnerWidth": 1920,
            "targetBrowserFontSizeFactor": browserFontSizeFactor
        };
    };


createRoot(document.getElementById("root")!).render(
    <ThemeProvider
        getViewPortConfig={getViewPortConfig}
        splashScreen={splashScreen}
    >
        <MyComponent />
    </ThemeProvider>,
);
