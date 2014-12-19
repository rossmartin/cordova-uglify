#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');
var ngAnnotate = require("ng-annotate");
var cssMinifier = new CleanCSS({
    noAdvanced: true, // disable advanced optimizations - selector & property merging, reduction, etc.
    keepSpecialComments: 0 // remove all css comments ('*' to keep all, 1 to keep first comment only)
});

var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;
var isRelease = true; // by default this hook is always enabled, see below on how to execute it only for release
//var isRelease = (cliCommand.indexOf('--release') > -1); // comment the above line and uncomment this line to turn the hook on only for release
if (!isRelease) {
    return;
}
console.log('cordova-uglify will always run by default, read line 16 in this script to enable it only for release');

switch(platform) {
    case 'android':
        platformPath += '/' + platform + '/assets/www';
        break;
    case 'ios':
        platformPath += '/' + platform + '/www';
        break;
    default:
        console.log('this hook only supports android and ios currently');
        return;
}

var foldersToProcess = [ // add other www folders in here if needed (ex. js/controllers)
    'js',
    'css'
];

foldersToProcess.forEach(function(folder) {
    processFiles(platformPath + '/' + folder);
});

function processFiles(dir) {
    fs.readdir(dir, function(err, list) {
        if (err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (!stat.isDirectory()) {
                    compress(file);
                }
            });
        });
    });
}

function compress(file) {
    var ext = path.extname(file);
    switch(ext) {
        case '.js':
            console.log('uglifying js file ' + file);
	        var res = ngAnnotate(String(fs.readFileSync(file)), { add: true });
            var result = UglifyJS.minify(res.src, {
                compress: { // pass false here if you only want to minify (no obfuscate)
                    drop_console: true // remove console.* statements (log, warn, etc.)
                },
                fromString: true
            });
            fs.writeFileSync(file, result.code, 'utf8'); // overwrite the original unminified file
            break;
        case '.css':
            console.log('minifying css file ' + file);
            var source = fs.readFileSync(file, 'utf8');
            var result = cssMinifier.minify(source);
            fs.writeFileSync(file, result, 'utf8'); // overwrite the original unminified file
            break;
        default:
            console.log('encountered a ' + ext + ' file, not compressing it');
            break;
    }
}
