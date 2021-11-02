<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/120405033-efe83900-c347-11eb-9a7c-7b680c26a18c.png">  
</p>
<p align="center">
    <i>A disruptive UI toolkit</i><br>
    <i>Optimized for TypeScript</i><br>
    <i>Highly customizable but looks great out of the box.</i><br>
    <i>Compatible with mui large library of components</i>
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

Default design system carefully crafted by [Marc Hufschmitt](http://marchufschmitt.fr/)

This project is under active development. It's APIs are susceptible to change until v1.

WARNING: `onyxia-ui` isn't currently working with SSR. (You can't use it with Next.js)

# Motivation

[Material-ui](https://mui.com) is at it's core a vanilla JavaScript library.  
We argue that the experience for TypeScript developers is not optimal and somewhat frustrating.
Also we find problematic how hard it is to build an app that won't break on any other screen size.
In consequence, we wanted to create a ui toolkit that would be compatible with
`mui` v5 large library of components but that would also improves it in the following ways:

-   Optimized for typescript, theme customization without module augmentation.
-   Responsive design **way** more easy to implement.
-   Built in support for the dark mode, persistent across reload.
-   Easier, more guided, theme customization.
-   Provide splash screen that hides your components while they are not yet loaded.
-   Leverages an arguably better styling API: [TSS](https://github.com/garronej/tss-react).

# Showcase

UI built with this toolkit.

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
yarn add onyxia-ui @mui/material @emotion/react @emotion/styled tss-react powerhooks

# If you plan on using icons from: https://mui.com/components/material-icons/
yarn add @mui/icons-material
```

At this stage, the documentation is under the form of a very simple [demo project](https://github.com/garronej/onyxia-ui/tree/main/src/test).  
The actual theme configuration [happens here](https://github.com/garronej/onyxia-ui/blob/main/src/test/src/theme.ts).  
If you want to experiment with it you can run the demo app with:

NOTE for [Storybook](https://storybook.js.org) users: As of writing this lines storybook still uses by default emotion 10.  
mui and TSS runs emotion 11 so there is [some changes](https://github.com/garronej/onyxia-ui/blob/324de62248074582b227e584c53fb2e123f5325f/.storybook/main.js#L31-L32)
to be made to your `.storybook/main.js` to make it uses emotion 11.

```bash
git clone https://github.com/garronej/onyxia-ui
cd onyxia-ui
yarn
yarn build
yarn start
```
