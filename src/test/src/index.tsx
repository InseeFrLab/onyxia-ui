import { render } from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { ReactComponent as CompanyLogo } from "./assets/company-logo.svg";
import { Text } from "./theme";
import { getIsPortraitOrientation } from "onyxia-ui";

//example: https://user-images.githubusercontent.com/6702424/120894826-a97e2d00-c61a-11eb-8b2d-a2b9f9485837.png

render(
    <ThemeProvider
        getViewPortConfig={({ browserFontSizeFactor, windowInnerHeight, windowInnerWidth }) => {

            if (
                getIsPortraitOrientation({
                    windowInnerWidth,
                    windowInnerHeight
                })
            ) {
                return <Text typo="my hero">Rotate your screen</Text>
            }

            return {
                "targetWindowInnerWidth": 1920,
                "targetBrowserFontSizeFactor": browserFontSizeFactor
            };

        }}
        splashScreen={{
            "Logo": CompanyLogo,
            "fadeOutDuration": 500
        }}
    >
        <MyComponent />
    </ThemeProvider>,
    document.getElementById("root"),
);
