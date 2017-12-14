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
    const folder = compiler.options.context;
    const ojCore = path.join(folder, this.ojCorePath);
    let originalOjCore = fs.readFileSync(ojCore, 'utf8');
  
    const newOjCore = originalOjCore
                                    // avoid un-resolvable dynamic require
                                    .replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,")
                                    // we don't want 'oj' to be added in window
                                    .replace("typeof window !== 'undefined'", "false")
                                    // self equals to window, so we replace it for a new object
                                    .replace("_scope = self;", "_scope = {};")
                                    // if amd is present, we define the ojs/ojcore module returning our oj object
                                    .replace(";return oj;", `
                                              if(oj.__isAmdLoaderPresent()) {
                                                define("ojs/ojcore", [], function() {
                                                  return oj;
                                                } );
                                              }
                                              ;return oj;`);

    fs.writeFileSync(ojCore, newOjCore);

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
