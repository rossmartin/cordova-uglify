#!/usr/bin/env node

//After install script - installs the cordova hook into hooks/after_prepare directory

//We assume after post install, this script is run from its root directory

//Before
// ./proj
//      /hooks
//      /node_modules
//          /cordova-uglify
//              /after_prepare
//                  /uglify.js
//              /scripts
//                  install.js
//                  uninstall.js

//After
// ./proj
//      /hooks
//          /after_prepare
//              uglify.js
//      /node_modules
//          /cordova-uglify
//              /after_prepare
//                  uglify.js

var fs = require('fs')
var path = require('path')
var cwd = process.cwd(); //proj directory
var scriptPath = __dirname //node_modules/cordova-uglify/scripts

var paths = [ path.join(cwd, '../../hooks'), path.join(cwd, '../../hooks/after_prepare') ];

for (var pathIndex in paths) {
    if (!fs.existsSync(paths[pathIndex])) {
        console.log('Creating directory: ', paths[pathIndex]);
        fs.mkdirSync(paths[pathIndex]);
    }   
}

var uglifyScriptPath = path.join(cwd, 'after_prepare', 'uglify.js');

var uglifyFile = fs.readFileSync(uglifyScriptPath);
//console.log('uglifyFile: ', uglifyFile);
var uglifyAfterPreparePath = path.join(paths[1], 'uglify.js');

//console.log('Creating uglify hook: ', uglifyAfterPreparePath);
fs.writeFileSync(uglifyAfterPreparePath, uglifyFile);

var uglifyConfigFile = fs.readFileSync(path.join(__dirname, '../uglify-config.json'));
fs.writeFileSync(path.join(paths[0], 'uglify-config.json'), uglifyConfigFile);
