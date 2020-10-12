#!/usr/bin/env node

//After uninstall script to remove the uglify.js script from the users hooks/after_prepare directory

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var cwd = process.cwd(); // $(project)/node_modules/cordova-uglify

var uglifyJsPath = path.join(
  cwd,
  '../../',
  'hooks',
  'after_prepare',
  'uglify.js'
);
var configFilePath = path.join(cwd, '../../', 'hooks', 'uglify-config.json');

fs.unlinkSync(uglifyJsPath);
fs.unlinkSync(configFilePath);

console.log('removed ' + uglifyJsPath + ' and ' + configFilePath);

var cordovaConfigFilePath = path.join(cwd, '../../', 'config.xml'); // top-level config.xml
var cordovaConfigFileData = fs.readFileSync(cordovaConfigFilePath);

if (cordovaConfigFileData.indexOf('hooks/after_prepare/uglify.js') === -1) {
  return;
}

var parser = new xml2js.Parser();
parser.parseString(cordovaConfigFileData, function(err, result) {
  if (err) {
    console.log(err);
    return;
  }

  var indexToDelete;
  result.widget.hook.forEach(function(node, i) {
    if (node.$.src === 'hooks/after_prepare/uglify.js') {
      indexToDelete = i;
    }
  });

  if (indexToDelete > -1) {
    result.widget.hook.splice(indexToDelete, 1);
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    fs.writeFileSync(cordovaConfigFilePath, xml);
  }
});
