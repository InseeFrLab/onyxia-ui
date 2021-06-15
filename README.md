<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/120405033-efe83900-c347-11eb-9a7c-7b680c26a18c.png">  
</p>
<p align="center">
    <i>A modern UI toolkit with excellent typing.</i><br>
    <i>Highly customizable but looks great out of the box.</i><br>
    <i>Build on top of material-ui.</i>
    <br>
    <br>
    <img src="https://github.com/garronej/onyxia-ui/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/onyxia-ui">
    <img src="https://img.shields.io/npm/dw/onyxia-ui">
    <img src="https://img.shields.io/npm/l/onyxia-ui">
</p>
<p align="center">
  <a href="https://ui.onyxia.dev">Documentation</a>
</p>

`onyxia-ui` is a ui toolkit for React build on top of [`material-ui`](https://material-ui.com).

Design by [Marc Hufschmitt](http://marchufschmitt.fr/)

# Motivation

[Material-ui](https://material-ui.com) is at it's core a vanilla JavaScript library.  
We argue that the experience for TypeScript developers is not optimal and somewhat frustrating.
In consequence, we wanted to create a ui toolkit that would be compatible with
`material-ui` components but that would also improves it in the following ways:

-   Providing better typing.
-   Arguably better styling API: [TSS](https://github.com/garronej/tss-react).
-   Built in support for the dark mode, persistent across reload, without white flashes.
-   Enable the app to look the same regardless of the screen size (If there isn't enough time for implementing responsive design).
-   Easier, more guided, theme customization.
-   Provide splash screen that hides your components while they are not yet loaded.
-   Provides smarter core components that require less boiler plate.

# Showcase

UI built with this toolkit.

## [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)

![scree_myservices](https://user-images.githubusercontent.com/6702424/121828699-a8a36600-ccc0-11eb-903c-1cd4b6cbb0ff.png)
![screen_launcher](https://user-images.githubusercontent.com/6702424/121828696-a80acf80-ccc0-11eb-86fb-c7d0bca55d4f.png)
![screen_main_services](https://user-images.githubusercontent.com/6702424/121828700-a93bfc80-ccc0-11eb-8149-f6c85c06cffd.png)
![my_secrets](https://user-images.githubusercontent.com/6702424/121828695-a5a87580-ccc0-11eb-9e86-295fdac6c497.png)

## [onyxia.dev](https://onyxia.dev)

## [sspcloud.fr](https://sspcloud.fr)

# Quick start

```bash
yarn add onyxia-ui tss-react @material-ui/core@^4.11.4

# If you plan on using icons from: https://material-ui.com/components/material-icons/
yarn add @material-ui/icons@^4.11.2

# Only necessary for onyxia-ui/Alert and if you want
# to use components from https://material-ui.com/components/material-icons/
yarn add @material-ui/lab@^4.0.0-alpha.58
```

`src/theme.ts`:

```tsx
import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultTypography,
} from "onyxia-ui/lib";
import { createIcon } from "onyxia-ui/Icon";
import { createIconButton } from "onyxia-ui/IconButton";
import { createButton } from "onyxia-ui/Button";
import "onyxia-design-lab/assets/fonts/work-sans.css";
import { createUseClassNamesFactory } from "tss-react";

//Import icons from https://material-ui.com/components/material-icons/ that you plan to use
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EditIcon from "@material-ui/icons/Edit";

//Import your custom icons
import { ReactComponent as FooSvg } from "./assets/svg/foo.svg";
import { ReactComponent as BarSvg } from "./assets/svg/bar.svg";

export const { ThemeProvider, useTheme } = createThemeProvider({
    //We keep the default color palette but we add a custom color: a shiny pink.
    "typography": {
        ...defaultTypography,
        "fontFamily": '"Work Sans", sans-serif',
    },
    "palette": {
        ...defaultPalette,
        "shinyPink": {
            "main": "#3333",
        },
    },
    //We keep the default surceases colors except that we add
    //a new usage scenario: "flash" and we use our pink within.
    "createColorUseCases": ({ isDarkModeEnabled, palette }) => ({
        ...createDefaultColorUseCases({ isDarkModeEnabled, palette }),
        "flashes": {
            "cute": palette.shinyPink.main,
            "warning": palette.orangeWarning.light,
        },
    }),
});

export const { createUseClassNames } = createUseClassNamesFactory({ useTheme });

export const { Icon } = createIcon({
    "hello": EmojiPeopleIcon,
    "edit": EditIcon,
    "foo": FooSvg,
    "bar": BarSvg,
});

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
```

`src/index.tsx`:

```tsx
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent";
import { SplashScreenProvider } from "onyxia-ui/splashScreen";
import { ReactComponent as CompanyLogo } from "./assets/svg/company-logo.svg";
import { Typography } from "onyxia-ui/Typography";

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
```

`src/MyComponent.tsx`:

```tsx
import { useEffect, useState } from "react";
import { createUseClassNames, Icon } from "./theme";
//Cherry pick the custom components you wish to import.
import { Typography } from "../../Typography";
//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
import { useIsDarkModeEnabled } from "../../lib";
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@material-ui/core/Switch";
import { useSplashScreen } from "../../splashScreen";

//See: https://github.com/garronej/tss-react
const { useClassNames } = createUseClassNames()(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.background,
        /*
        theme.colors.palette.shinyPink.main <- your custom color
        theme.colors.useCases.flashes.cute  <- your custom use case
        theme.muiTheme                      <- the theme object as defined by @material-ui/core
        */
    },
}));

export function MyComponent() {
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const { classNames } = useClassNames({});

    {
        const { hideRootSplashScreen } = useSplashScreen();

        useEffect(() => {
            //Call this when your component is in a state ready to be shown
            hideRootSplashScreen();
        }, []);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    // This pattern let you display the splash screen when the isLoading state is true.
    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (isLoading) {
                showSplashScreen({ "enableTransparency": true });
            } else {
                hideSplashScreen();
            }
        }, [isLoading]);
    }

    return (
        <div className={classNames.root}>
            <Typography>
                <Icon id="hello" />
                Hello World
            </Typography>
            <Switch
                checked={isDarkModeEnabled}
                onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
            />
        </div>
    );
}
```
