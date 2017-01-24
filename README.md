# oj-plugin

Webpack plugin to replace conflicting code from Oracle Jet's `ojs/ojcore` file

## Installation

`npm install --save oj-loader`

## How to use

```javascript
const ojPlugin = require('oj-plugin');

//...

plugins: [
  // ...
  new ojPlugin()
]
```

## What it does

Replaces the dynamic require (`require(requestedBundles` inside `oj/core` `oj.Config.setLocale` function) 
before Webpack parses it, and copies it back after it.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)