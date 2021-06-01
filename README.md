<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>A ui toolkit, like material-ui but with stronger typing and more opinionated</i>
    <br>
    <br>
    <img src="https://github.com/garronej/onyxia-ui/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/onyxia-ui">
    <img src="https://img.shields.io/npm/dw/onyxia-ui">
    <img src="https://img.shields.io/npm/l/onyxia-ui">
</p>
<p align="center">
  <a href="https://github.com/garronej/onyxia-ui">Home</a>
  -
  <a href="https://github.com/garronej/onyxia-ui">Documentation</a>
</p>

# Install / Import

```bash
$ npm install --save onyxia-ui
```

```typescript
import { myFunction, myObject } from "onyxia-ui";
```

Specific imports:

```typescript
import { myFunction } from "onyxia-ui/myFunction";
import { myObject } from "onyxia-ui/myObject";
```

## Import from HTML, with CDN

Import it via a bundle that creates a global ( wider browser support ):

```html
<script src="//unpkg.com/onyxia-ui/bundle.min.js"></script>
<script>
    const { myFunction, myObject } = onyxia_ui;
</script>
```

Or import it as an ES module:

```html
<script type="module">
    import { myFunction, myObject } from "//unpkg.com/onyxia-ui/zz_esm/index.js";
</script>
```

_You can specify the version you wish to import:_ [unpkg.com](https://unpkg.com)

## Contribute

```bash
npm install
npm run build
npm test
```
