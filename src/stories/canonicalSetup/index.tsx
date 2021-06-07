import * as ReactDOM from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { SplashScreenProvider } from "../../splashScreen";
import { ReactComponent as CompanyLogo } from "./assets/svg/company-logo.svg";
import { Typography } from "../../Typography";

ReactDOM.render(
    <ThemeProvider
        //Enable the app to look exactly the same regardless of the screen size.
        //Remove this prop if you have implemented responsive design.
        zoomProviderReferenceWidth={1920}
        //With zoom provider enabled portrait mode is often unusable
        //example: https://user-images.githubusercontent.com/6702424/120894826-a97e2d00-c61a-11eb-8b2d-a2b9f9485837.png
        portraitModeUnsupportedMessage={<Typography variant="h3">Please rotate your phone</Typography>}
    >
        <SplashScreenProvider Logo={CompanyLogo}>
            <MyComponent />
        </SplashScreenProvider>
    </ThemeProvider>,
    document.getElementById("root"),
);
