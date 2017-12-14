# oj-plugin

Webpack plugin to replace conflicting code from Oracle Jet's `ojs/ojcore` file

## Installation

`yarn add oj-plugin`

## How to use

```javascript
const ojPlugin = require('oj-plugin');

//...

plugins: [
  // ...
  new ojPlugin()
]
```

```javascript
plugins: [
  // ...
  new ojPlugin({
    ojCorePath: "node_modules/oraclejet/dist/js/libs/oj/debug/ojcore.js"
  })
]
```

## What it does

Check the replacements done in the index.js. They are a few but are documented.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)