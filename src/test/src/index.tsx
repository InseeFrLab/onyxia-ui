import { render } from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { ReactComponent as CompanyLogo } from "./assets/company-logo.svg";
import { Text } from "./theme";
import { getIsPortraitOrientation } from "onyxia-ui";
import type { ThemeProviderProps } from "onyxia-ui";

const splashScreen: ThemeProviderProps["splashScreen"] = {
    "Logo": CompanyLogo,
    "fadeOutDuration": 500
};

const getViewPortConfig: ThemeProviderProps["getViewPortConfig"] =
    ({ windowInnerWidth, windowInnerHeight, browserFontSizeFactor }) =>
        getIsPortraitOrientation({ windowInnerWidth, windowInnerHeight }) ?
            <Text typo="my hero">Rotate your screen</Text> :
            {
                "targetWindowInnerWidth": 1920,
                "targetBrowserFontSizeFactor": browserFontSizeFactor
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
