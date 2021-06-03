<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/120405033-efe83900-c347-11eb-9a7c-7b680c26a18c.png">  
</p>
<p align="center">
    <i>A modern UI toolkit with excellent typing.</i><br>
    <i>Highly customizable, looks great out of the box.</i><br>
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
All `material-ui` components are compatible with `onyxia-ui`.

Design by [Marc Hufschmitt](http://marchufschmitt.fr/)

# Showcase

Some apps using this toolkit.

-   [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)
-   [onyxia.dev](https://onyxia.dev)
-   [sspcloud.fr](https://sspcloud.fr)

# Motivation

[Material-ui](https://material-ui.com) is at it's core a vanilla JavaScript library.  
We argue that the experience for TypeScript developers is not optimal and somewhat frustrating.

`onyxia-ui` tries to improves `material-ui` in the following ways:

-   Providing better typing.
-   Better styling API ([TSS](https://github.com/garronej/tss-react)).
-   Built in support for dark mode, persistent across reload, without white flashes.
-   Easier, more guided, theme customization.
-   Provides smarter core components that requires less boiler plate.
-   Provide splash screen.

You can checkout `onyxia-ui` builtins components [here](https://ui.onyxia.dev).
You can also use all `material-ui` components
The theme will be automatically adapted so they fit in nicely. You don't need to install
anything else than `onyxia-ui`, you can simply [`import Select from '@material-ui/core/Select';`](https://material-ui.com/components/selects/)
for example, it will work.

# Quick start

```bash
yarn add onyxia-ui tss-react
```

`src/theme.ts`:

```tsx
import {
    createThemeProvider,
    defaultPalette,
    createDefaultColorUseCases,
    defaultTypography
} from "onyxia-ui";
import "onyxia-design-lab/assets/fonts/work-sans.css";
import { createUseClassNamesFactory } from "tss-react";
import { SplashScreenProvider } from "onyxia-ui/splashScreen";

const { ThemeProvider, useTheme } = createThemeProvider({
    //We keep the default color palette but we add a custom color: a shiny pink.
    "typography": {
        ...defaultTypography
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
            "warning": palette.orangeWarning.light
        },
    }),
});

export { ThemeProvider }

export const { createUseClassNames } = createUseClassNamesFactory({ useTheme });

```

`src/index.tsx`:

```tsx
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "./theme";
import { MyComponent } from "./MyComponent.txt";

ReactDOM.render(
    <ThemeProvider>
        <SplashScreenProvider>
            <MyComponent />
        </SplashScreenProvider>
    </ThemeProvider>,
    document.getElementById("root"),
);
```

`src/MyComponent.tsx`:

```tsx
import { useEffect } from "react";
import { createUseClassNames } from "./theme.ts";
//Cherry pick the custom components you wish to import.
import { Button } from "onyxia-ui/Button";
//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
import { useIsDarkModeEnabled } from "onyxia-ui";
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@material-ui/core/Switch";
import { hideSplashScreen } from "onyxia-ui/splashScreen";

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

function MyComponent() {
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const { classNames } = useClassNames({});

    useEffect(() => {
        //Call this when your component is in a state ready to be shown
        hideSplashScreen();
    }, []);

    return (
        <div className={classNames.root}>
            <Button onClick={() => console.log("click")}>Hello World</Button>
            <Switch
                checked={isDarkModeEnabled}
                onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
            />
        </div>
    );
}
```
