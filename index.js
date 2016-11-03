// MyPlugin.js

function OjPlugin(options) {
  // Configure your plugin with options...
}

OjPlugin.prototype.apply = function(compiler) {
  var ojCore = "ojs/ojcore";
  var folder = compiler.options.context;
  
  console.log(folder)


  var entry = path.join(folder, self.entry);
  var output = path.join(folder, self.output);

  fs.readFile(entry, 'utf8', function (err, data) {
    data.replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,")
    
    compiler.plugin('done', function (stats) {
      data = data.replace("myUniqueFunctionToReplaceInOjCore", "require");
      fs.writeFileSync(output, data);
    });
  });

};

module.exports = MyPlugin;