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

Design by [Marc Hufschmitt](http://marchufschmitt.fr/)

# Motivation

[Material-ui](https://material-ui.com) is at it's core a vanilla JavaScript library.  
We argue that the experience for TypeScript developers is not optimal and sometime frustrating.

`onyxia-ui` tries to improves `material-ui` in the following ways:

-   Providing better typing support.
-   Better styling API ([TSS](https://github.com/garronej/tss-react)).
-   Core support for the dark mode.
-   Easier, more guided, theme customization.
-   Provides smarter core components that requires less boiler plate.
-   Provide splash screen.

You can checkout `onyxia-ui` builtins components [here](https://ui.onyxia.dev).
You can also use all `material-ui` components
The theme will be automatically adapted so they fit in nicely. You don't need to install
anything else than `onyxia-ui`, you can simply [`import Select from '@material-ui/core/Select';`](https://material-ui.com/components/selects/)
for example, it will work.

# Showcase

-   [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)
-   [onyxia.dev](https://onyxia.dev)
-   [sspcloud.fr](https://sspcloud.fr)

# Install / Import

```bash
$ yarn add onyxia-ui
```

# Quick start

```typescript
// theme.ts

import { createThemeProvider, defaultPalette, createDefaultColorUseCases } from "onyxia-ui";
import "onyxia-design-lab/assets/fonts/work-sans.css";
import { createUseClassNamesFactory } from "tss-react";

const { OnyxiaThemeProvider, useOnyxiaTheme } = createThemeProvider({
    //We keep the default color palette but we add a custom color: a shiny pink.
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
            "sad": palette.orangeWarning.light,
        },
    }),
});

export const { createUseClassNames } = createUseClassNamesFactory({ "useTheme": useOnyxiaTheme });

//index.ts

function Root() {
    //Example to show how to access the theme object.
    //Note that it works even outside the <OnyxiaThemeProvider/>
    const onyxiaTheme = useOnyxiaTheme();

    //If we waned to retrieve our pink:
    onyxiaTheme.colors.palette.shinyPink.main;
    //If we wanted the color of pink flashes:
    onyxiaTheme.colors.useCases.flashes.cute;
    //Here you have the theme object as defined by material-ui.
    onyxiaTheme.muiTheme;

    return (
        <OnyxiaThemeProvider>
            <MyComponent />
        </OnyxiaThemeProvider>
    );
}

//MyComponent

import { useIsDarkModeEnabled } from "onyxia-ui";
import { Button } from "onyxia-ui/Button";
import { createUseClassNames } from "./theme.ts";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//See: https://github.com/garronej/tss-react
const { useClassNames } = createUseClassNames()(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.flashes.cute,
    },
}));

function MyComponent() {
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const { classNames } = useClassNames({});

    return (
        <div className={classNames.root}>
            <Button>Hello World</Button>
            <Select>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </div>
    );
}
```
