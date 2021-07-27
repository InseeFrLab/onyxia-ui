<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/120405033-efe83900-c347-11eb-9a7c-7b680c26a18c.png">  
</p>
<p align="center">
    <i>A disruptive UI toolkit</i><br>
    <i>Optimized for TypeScript</i><br>
    <i>Highly customizable but looks great out of the box.</i><br>
    <i>Compatible with material-ui large library of components</i>
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

Default design system carefully crafted by [Marc Hufschmitt](http://marchufschmitt.fr/)

This project is under active development. It's APIs are susceptible to change until v1.

# Motivation

[Material-ui](https://material-ui.com) is at it's core a vanilla JavaScript library.  
We argue that the experience for TypeScript developers is not optimal and somewhat frustrating.
Also we find problematic how hard it is to build an app that won't break on any other screen size.
In consequence, we wanted to create a ui toolkit that would be compatible with
`material-ui`'s large library of components but that would also improves it in the following ways:

-   Optimized for typescript, theme customization without module augmentation.
-   Responsive design **way** more easy to implement.
-   Built in support for the dark mode, persistent across reload, without white flashes.
-   Easier, more guided, theme customization.
-   Provide splash screen that hides your components while they are not yet loaded.
-   Leverages an arguably better styling API: [TSS](https://github.com/garronej/tss-react).

# Showcase

UI built with this toolkit.

## [datalab.sspcloud.fr](https://datalab.sspcloud.fr/catalog/inseefrlab-helm-charts-datascience)

![scree_myservices](https://user-images.githubusercontent.com/6702424/121828699-a8a36600-ccc0-11eb-903c-1cd4b6cbb0ff.png)
![screen_launcher](https://user-images.githubusercontent.com/6702424/121828696-a80acf80-ccc0-11eb-86fb-c7d0bca55d4f.png)
![screen_main_services](https://user-images.githubusercontent.com/6702424/121828700-a93bfc80-ccc0-11eb-8149-f6c85c06cffd.png)
![my_secrets](https://user-images.githubusercontent.com/6702424/121828695-a5a87580-ccc0-11eb-9e86-295fdac6c497.png)

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/126612946-c9e0a0ce-3390-4d83-87e1-cdcb6ba623a5.gif">
</p>

<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/126614698-183e797f-a1e3-4e03-98c3-82d4b1c09bc3.gif">
</p>

## [sspcloud.fr](https://sspcloud.fr)

# Quick start

```bash
yarn add onyxia-ui tss-react @material-ui/core@^4.12.1

# If you plan on using icons from: https://material-ui.com/components/material-icons/
yarn add @material-ui/icons@^4.11.2

# Only necessary for onyxia-ui/Alert and if you want
# to use components from https://material-ui.com/components/material-icons/
yarn add @material-ui/lab@^4.0.0-alpha.58
```

At this stage, the documentation is under the form of a very simple [demo project](https://github.com/garronej/onyxia-ui/tree/main/src/test).  
The actual theme configuration [happens here](https://github.com/garronej/onyxia-ui/blob/main/src/test/src/theme.ts).  
If you want to experiment with it you can run the demo app with:

```bash
git clone https://github.com/garronej/onyxia-ui
cd onyxia-ui
yarn
yarn build
yarn start
```
