// MyPlugin.js

const path = require('path');
const fs = require('fs');

function OjPlugin(options) {
  // Configure your plugin with options...
}

OjPlugin.prototype.apply = function(compiler) {
  var self = this;
  var ojCore = "ojs/ojcore";
  var folder = compiler.options.context;

  var ojCore = path.join(folder, "bower_components/oraclejet/dist/js/libs/oj/debug/ojcore.js");

  fs.readFile(ojCore, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    fs.writeFileSync(ojCore, data.replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,"));

    compiler.plugin('done', function (stats) {
      var outputPath = compiler.outputPath;
      Object.keys(stats.compilation.assets).filter(asset => asset.match(/\.js$/) !== null)
        .map(bundle => path.join(outputPath, bundle))
        .forEach(function(bundle){
          var newOutput = fs.readFileSync(bundle, 'utf8').replace("myUniqueFunctionToReplaceInOjCore", "require");
          fs.writeFileSync(bundle, newOutput);
        });
    });
  });

};

module.exports = OjPlugin;