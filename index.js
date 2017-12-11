const path = require('path');
const fs = require('fs');
const ConcatSource = require('webpack-sources').ConcatSource;

const defaultOjCorePath = "node_modules/oraclejet/dist/js/libs/oj/debug/ojcore.js";

module.exports = class ojPlugin {
  constructor(options) {
    this.options = options;
    this.ojCorePath = defaultOjCorePath;
    
    if (options) {
      this.ojCorePath = options.ojCorePath || defaultOjCorePath;
    }
  }
  apply(compiler) {
    var folder = compiler.options.context;
    var ojCore = path.join(folder, this.ojCorePath);
    var originalOjCore = fs.readFileSync(ojCore, 'utf8');
  
    fs.writeFileSync(ojCore, originalOjCore.replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,"));
  
    compiler.plugin("compilation", function (compilation) {
      //the main compilation instance
      //all subsequent methods are derived from compilation.plugin
      compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
        //ToDo this seems a pretty non-performant approach, need to figure out how to improve it
        chunks.forEach(function (chunk) {
          chunk.files.forEach(function (file) {
            compilation.assets[file] = new ConcatSource(compilation.assets[file].source().replace("myUniqueFunctionToReplaceInOjCore", "require"));
          });
        });
        fs.writeFileSync(ojCore, originalOjCore);
        callback();
      });
    });
  }
};
