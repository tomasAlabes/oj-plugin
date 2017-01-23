// MyPlugin.js

const path = require('path');
const fs = require('fs');
const ConcatSource = require('webpack-sources').ConcatSource;

function OjPlugin(options) {
  // Configure your plugin with options...
}

OjPlugin.prototype.apply = function (compiler) {
  var self = this;
  var ojCore = "ojs/ojcore";
  var folder = compiler.options.context;

  var ojCore = path.join(folder, "bower_components/oraclejet/dist/js/libs/oj/debug/ojcore.js");
  var originalOjCore = fs.readFileSync(ojCore, 'utf8');

  fs.writeFileSync(ojCore, originalOjCore.replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,"));

  compiler.plugin("compilation", function (compilation) {
    //the main compilation instance
    //all subsequent methods are derived from compilation.plugin
    compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
      chunks.forEach(function (chunk) {
        chunk.files.forEach(function (file) {
          compilation.assets[file] = new ConcatSource(compilation.assets[file].source().replace("myUniqueFunctionToReplaceInOjCore", "require"));
        });
      });
      fs.writeFileSync(ojCore, originalOjCore);
      callback();
    });
  });

};

module.exports = OjPlugin;