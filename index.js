const path = require('path');
const fs = require('fs');
const ConcatSource = require('webpack-sources').ConcatSource;

function OjPlugin(options) {
  // Configure plugin with options...
  if (options) {
    this.ojCorePath = options.ojCorePath || "bower_components/oraclejet/dist/js/libs/oj/debug/ojcore.js";
  }
}

OjPlugin.prototype.apply = function (compiler) {
  var folder = compiler.options.context;
  var ojCore = path.join(folder, this.ojCorePath);
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