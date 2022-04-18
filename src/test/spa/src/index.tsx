import { render } from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { Text, splashScreen } from "./theme";
import { getIsPortraitOrientation, ViewPortOutOfRangeError } from "onyxia-ui";
import type { ThemeProviderProps } from "onyxia-ui";


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

render(
    <ThemeProvider
        getViewPortConfig={getViewPortConfig}
        splashScreen={splashScreen}
    >
        <MyComponent />
    </ThemeProvider>,
    document.getElementById("root"),
);
