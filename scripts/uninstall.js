#!/usr/bin/env node

//After uninstall script to remove the uglify.js script from the users hooks/after_prepare directory

var fs = require('fs');
var path = require('path');
var cwd = process.cwd(); // $(project)/node_modules/cordova-uglify

var uglifyJsPath = path.join(cwd, '../../', 'hooks', 'after_prepare', 'uglify.js');
var configFilePath = path.join(cwd, '../../', 'hooks', 'uglify-config.json');

fs.unlink(uglifyJsPath);
fs.unlink(configFilePath);

console.log('removed ' + uglifyJsPath + ' and ' + configFilePath);
