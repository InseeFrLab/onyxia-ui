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
-   Icons are downloaded at runtime. [The full catalog of mui icons](https://mui.com/material-ui/material-icons/) is
    is available **at runtime**. (No hard import required)

Disclaimer: `onyxia-ui` is specifically designed to build SPA and is not SSR compatible.

A note about the integration of [Onyxia](https://onyxia.sh) and Onyxia-UI can be found [here](https://docs.onyxia.sh/contributing/onyxia/dependencies#onyxia-ui).

# Showcase

## [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)

<p align="center">
  <img src="https://user-images.githubusercontent.com/6702424/136545513-f623d8c7-260d-4d93-a01e-2dc5af6ad473.gif"/>
  <img src="https://user-images.githubusercontent.com/6702424/121828699-a8a36600-ccc0-11eb-903c-1cd4b6cbb0ff.png"/>
  <img src="https://user-images.githubusercontent.com/6702424/121828696-a80acf80-ccc0-11eb-86fb-c7d0bca55d4f.png"/>
  <img src="https://user-images.githubusercontent.com/6702424/121828700-a93bfc80-ccc0-11eb-8149-f6c85c06cffd.png" />
  <img src="https://user-images.githubusercontent.com/6702424/121828695-a5a87580-ccc0-11eb-9e86-295fdac6c497.png"/>
  <img src="https://user-images.githubusercontent.com/6702424/126612946-c9e0a0ce-3390-4d83-87e1-cdcb6ba623a5.gif">
  <img src="https://user-images.githubusercontent.com/6702424/126614698-183e797f-a1e3-4e03-98c3-82d4b1c09bc3.gif">
</p>

## [datalab.sspcloud.fr with "France" palette](https://datalab.sspcloud.fr/?palette=france&title=Etalab)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/139843650-8907ac5b-9fde-41ce-9c7d-9df9e10ce3e1.png" />
    <img src="https://user-images.githubusercontent.com/6702424/139843848-8fe5d132-5cd2-4840-8719-e6d5929b07d3.png" />
</p>

## [datalab.sspcloud.fr with "Ultraviolet" palette](https://datalab.sspcloud.fr/?palette=ultraviolet&title=AUS)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/139844196-0079858c-6778-4569-a7f8-409f1ce9652d.png" />
    <img src="https://user-images.githubusercontent.com/6702424/139844260-b4948b34-eca1-4d5b-a5c9-e856500fe921.png" />
</p>

## [www.sspcloud.fr](https://www.sspcloud.fr)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/136541663-bc1672c7-d4e2-4b65-ae6e-7a222d7ef71d.png" />
    <img src="https://user-images.githubusercontent.com/6702424/136541792-3e267d15-3e56-4f27-9b62-57500f69bbaa.png" />
    <img src="https://user-images.githubusercontent.com/6702424/136541968-a3c718ae-1a1a-48aa-823f-afcecb475e55.png" />
</p>

# Quick start

```bash
yarn add onyxia-ui @mui/material @emotion/react @emotion/styled
```

## Icons

Onyxia-ui enables you to use icons from [the Material Design Library](https://mui.com/material-ui/material-icons/).  
Or to provide your own icon as SVG urls.

### Using Material Icons: With hard import

If you know what icon you'll need ahead of time, implement this approach:

```bash
yarn add @mui/icons-material
```

`src/theme.ts`

```ts
const { ThemeProvider } = createThemeProvider({
    // ...
    publicUrl: undefined,
});
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

## Documentation

The documentation is under the form of a very simple [demo project](https://github.com/garronej/onyxia-ui/tree/main/src/test).  
The actual theme configuration [happens here](https://github.com/garronej/onyxia-ui/blob/main/src/test/src/theme.ts).  
If you want to experiment with it you can run the demo app with:

NOTE for [Storybook](https://storybook.js.org) users: As of writing this lines storybook still uses by default emotion 10.  
mui and TSS runs emotion 11 so there is [some changes](https://github.com/garronej/onyxia-ui/blob/324de62248074582b227e584c53fb2e123f5325f/.storybook/main.js#L31-L32)
to be made to your `.storybook/main.js` to make it uses emotion 11.

[Launch dev environment](https://datalab.sspcloud.fr/launcher/inseefrlab-helm-charts-datascience/vscode?autoLaunch=true&onyxia.friendlyName=«Onyxia-ui»&onyxia.share=true&s3.enabled=false&kubernetes.role=«admin»&security.allowlist.enabled=false&git.repository=«https%3A%2F%2Fgithub.com%2FInseeFrLab%2Fonyxia-ui»&init.personalInit=«https%3A%2F%2Fraw.githubusercontent.com%2FInseeFrLab%2Fonyxia-ui%2Fmain%2Fonyxia-init.sh»)

```bash
git clone https://github.com/garronej/onyxia-ui
cd onyxia-ui
yarn
yarn build
yarn start
```
