# CommonJS to ESM playground

[Open the live demo](https://anubhav741.github.io/cjs-to-esm-demo/)

This playground installs [`@anubhav741/cjs_esm`](https://www.npmjs.com/package/@anubhav741/cjs_esm) from npm. Pick an example or edit the CommonJS input. The browser calls the package on each edit and displays the resulting ES module. All conversion happens locally in your browser.

## Run locally

With Node.js 24.11 or newer and npm installed, run these commands in the repository:

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:4173/>. To create a static production build in `dist/`, run `npm run build`. Pushes to `main` build and deploy the live demo via GitHub Actions.

## How the demo uses the package

[`src/playground.js`](./src/playground.js) imports the published converter directly:

```js
import { convertCjsToEsm } from "@anubhav741/cjs_esm";

const result = convertCjsToEsm('const path = require("node:path");\nmodule.exports = path;');
console.log(result);
// import path from "node:path";
// export default path;
```

Try changing `module.exports = { assetPath };` to `module.exports = assetPath;` in the Path utilities example to see a named export become a default export. The converter handles common top-level patterns. Dynamic calls such as `require(variable)` can remain in the output. See the [package source](https://github.com/Anubhav741/cjs-to-esm-converter) for supported syntax.
