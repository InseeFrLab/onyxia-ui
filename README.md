<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/120405033-efe83900-c347-11eb-9a7c-7b680c26a18c.png">  
</p>
<p align="center">
    <i>The Onyxia UI toolkit</i><br>
    <br>
    <br>
    <img src="https://github.com/garronej/onyxia-ui/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/onyxia-ui">
    <img src="https://img.shields.io/npm/dw/onyxia-ui">
    <img src="https://img.shields.io/npm/l/onyxia-ui">
</p>
<p align="center">
  <a href="https://inseefrlab.github.io/onyxia-ui/">Documentation</a>
</p>

This project is a React UI toolkit that implement a design system created for [Onyxia](https://onyxia.sh) by [Marc Hufschmitt](http://marchufschmitt.fr/).

This project provide [some custom components](https://inseefrlab.github.io/onyxia-ui/?path=/story/sandbox-alert--vue-no-title) but you can also use
any [MUI component](https://mui.com/) they will be automatically styled to fit the design system.

-   Optimized for typescript, theme customization without module augmentation.
-   Built in support for the dark mode.
-   If you want to diverge from the Onyxia Design system, the theme is customizable, you can for example change the fonts and the colors.
-   Provide splash screen that hide the screen when needed.
-   Perfect for building white label Web APP: The theme and assets, icons can be configured at runtime.

Disclaimer: `onyxia-ui` is specifically designed to build SPA (Vite projects) and is not SSR compatible (Not compatible with Next).

> [!NOTE]  
> There's an extention of Onyxia UI for creating Landing pages: [gitlanding](https://github.com/thieryw/gitlanding)

# Showcase

## [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)

<p align="center">
  <img src="https://user-images.githubusercontent.com/6702424/136545513-f623d8c7-260d-4d93-a01e-2dc5af6ad473.gif"/>
</p>

## [datalab.sspcloud.fr with "France" palette](https://datalab.sspcloud.fr/?FONT=%7B%20%0A%20%20fontFamily%3A%20%22Marianne%22%2C%20%0A%20%20dirUrl%3A%20%22%25PUBLIC_URL%25%2Ffonts%2FMarianne%22%2C%20%0A%20%20%22400%22%3A%20%22Marianne-Regular.woff2%22%2C%0A%20%20%22400-italic%22%3A%20%22Marianne-Regular_Italic.woff2%22%2C%0A%20%20%22500%22%3A%20%22Marianne-Medium.woff2%22%2C%0A%20%20%22700%22%3A%20%22Marianne-Bold.woff2%22%2C%0A%20%20%22700-italic%22%3A%20%22Marianne-Bold_Italic.woff2%22%0A%7D%0A&PALETTE_OVERRIDE=%7B%0A%20%20focus%3A%20%7B%0A%20%20%20%20main%3A%20%22%23000091%22%2C%0A%20%20%20%20light%3A%20%22%239A9AFF%22%2C%0A%20%20%20%20light2%3A%20%22%23E5E5F4%22%0A%20%20%7D%2C%0A%20%20dark%3A%20%7B%0A%20%20%20%20main%3A%20%22%232A2A2A%22%2C%0A%20%20%20%20light%3A%20%22%23383838%22%2C%0A%20%20%20%20greyVariant1%3A%20%22%23161616%22%2C%0A%20%20%20%20greyVariant2%3A%20%22%239C9C9C%22%2C%0A%20%20%20%20greyVariant3%3A%20%22%23CECECE%22%2C%0A%20%20%20%20greyVariant4%3A%20%22%23E5E5E5%22%0A%20%20%7D%2C%0A%20%20light%3A%20%7B%0A%20%20%20%20main%3A%20%22%23F1F0EB%22%2C%0A%20%20%20%20light%3A%20%22%23FDFDFC%22%2C%0A%20%20%20%20greyVariant1%3A%20%22%23E6E6E6%22%2C%0A%20%20%20%20greyVariant2%3A%20%22%23C9C9C9%22%2C%0A%20%20%20%20greyVariant3%3A%20%22%239E9E9E%22%2C%0A%20%20%20%20greyVariant4%3A%20%22%23747474%22%0A%20%20%7D%0A%7D%0A)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/139843650-8907ac5b-9fde-41ce-9c7d-9df9e10ce3e1.png" />
    <img src="https://user-images.githubusercontent.com/6702424/139843848-8fe5d132-5cd2-4840-8719-e6d5929b07d3.png" />
</p>

## [datalab.sspcloud.fr with "Ultraviolet" palette](https://datalab.sspcloud.fr/?FONT=%7B%20%0A%20%20fontFamily%3A%20%22Geist%22%2C%20%0A%20%20dirUrl%3A%20%22%25PUBLIC_URL%25%2Ffonts%2FGeist%22%2C%20%0A%20%20%22400%22%3A%20%22Geist-Regular.woff2%22%2C%0A%20%20%22500%22%3A%20%22Geist-Medium.woff2%22%2C%0A%20%20%22600%22%3A%20%22Geist-SemiBold.woff2%22%2C%0A%20%20%22700%22%3A%20%22Geist-Bold.woff2%22%0A%7D%0A&PALETTE_OVERRIDE=%7B%0A%20%20focus%3A%20%7B%0A%20%20%20%20main%3A%20%22%23067A76%22%2C%0A%20%20%20%20light%3A%20%22%230AD6CF%22%2C%0A%20%20%20%20light2%3A%20%22%23AEE4E3%22%0A%20%20%7D%2C%0A%20%20dark%3A%20%7B%0A%20%20%20%20main%3A%20%22%232D1C3A%22%2C%0A%20%20%20%20light%3A%20%22%234A3957%22%2C%0A%20%20%20%20greyVariant1%3A%20%22%2322122E%22%2C%0A%20%20%20%20greyVariant2%3A%20%22%23493E51%22%2C%0A%20%20%20%20greyVariant3%3A%20%22%23918A98%22%2C%0A%20%20%20%20greyVariant4%3A%20%22%23C0B8C6%22%0A%20%20%7D%2C%0A%20%20light%3A%20%7B%0A%20%20%20%20main%3A%20%22%23F7F5F4%22%2C%0A%20%20%20%20light%3A%20%22%23FDFDFC%22%2C%0A%20%20%20%20greyVariant1%3A%20%22%23E6E6E6%22%2C%0A%20%20%20%20greyVariant2%3A%20%22%23C9C9C9%22%2C%0A%20%20%20%20greyVariant3%3A%20%22%239E9E9E%22%2C%0A%20%20%20%20greyVariant4%3A%20%22%23747474%22%0A%20%20%7D%0A%7D%0A)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/139844196-0079858c-6778-4569-a7f8-409f1ce9652d.png" />
    <img src="https://user-images.githubusercontent.com/6702424/139844260-b4948b34-eca1-4d5b-a5c9-e856500fe921.png" />
</p>

# Installation

`yarn add onyxia-ui @mui/material@5.16.7 @emotion/react @emotion/styled tss-react`

# Usage

The easyer way to get started is to checkout this demo repository: [onyxia-ui + gilanding starter](https://github.com/garronej/gitlanding-demo).

You can see more advanced examples here: [test app of this repo](https://github.com/InseeFrLab/onyxia-ui/tree/main/test-app).

## Icons

Onyxia-ui enables you to use icons from [the Material Design Library](https://mui.com/material-ui/material-icons/).  
Or to provide your own icon as SVG urls.

### Using Material Icons: With hard import

If you know what icon you'll need ahead of time, implement this approach:

```bash
yarn add @mui/icons-material@5.16.7
```

Now if you want to use [AccessAlarms](https://mui.com/material-ui/material-icons/?selected=AccessAlarms)

```tsx
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

<Icon icon={AccessAlarmIcon} />;
```

### Using Material Icons: With lazy loading

If you don't know ahead of time what icon you will need. This is the case if your app
renders user generated content that might include icons then you can opt for downloading the
icons dynamically.  
Be aware that this involves including a 35MB directory of icons in your `public/` directory
which will end up impacting your docker image size.

```diff
"scripts": {
    "prepare": "copy-material-icons-to-public"
}
```

OPTIONAL: Use cache in your Workflow to speed up your CI pipeline

```yarn
    - uses: bahmutov/npm-install@v1
      env:
        XDG_CACHE_HOME: "/home/runner/.cache/yarn"
```

This will enable you to do this:

```tsx
import { Icon } from "onyxia-ui/Icon";

// https://mui.com/material-ui/material-icons/?selected=AccessAlarms
<Icon icon="AccessAlarms" />;
```

Or, if you want type safety:

```tsx
import { Icon } from "onyxia-ui/Icon";
import { id } from "tsafe/id";
import type { MuiIconComponentName } from "onyxia-ui/MuiIconComponentName";

// https://mui.com/material-ui/material-icons/?selected=AccessAlarms
<Icon icon={id<MuiIconComponentName>("AccessAlarms")} />;
```

### Using custom SVGs as icons

```tsx
import myIconSvgUrl from "./assets/my-icon.svg";

<Icon icon={myIconSvgUrl} />
<Icon icon="https://example.com/foo/my-icon.svg" />
```
