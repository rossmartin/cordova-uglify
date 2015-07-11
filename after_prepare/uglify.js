#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var ngAnnotate = require('ng-annotate');

var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;

// hook configuration
var configFilePath = path.join(rootDir, 'hooks/uglify-config.json');
var hookConfig = JSON.parse(fs.readFileSync(configFilePath));
var isRelease = hookConfig.alwaysRun || (cliCommand.indexOf('--release') > -1);
var recursiveFolderSearch = hookConfig.recursiveFolderSearch; // set this to false to manually indicate the folders to process
var foldersToProcess = hookConfig.foldersToProcess; // add other www folders in here if needed (ex. js/controllers)
var cssMinifier = new CleanCSS(hookConfig.cleanCssOptions);

if (!isRelease) {
    return;
}

switch (platform) {
    case 'android':
        platformPath = path.join(platformPath, platform, 'assets', 'www');
        break;
    case 'ios': 
    case 'browser':
        platformPath = path.join(platformPath, platform, 'www');
        break;
    default:
        console.log('this hook only supports android, ios, and browser currently');
        return;
}

foldersToProcess.forEach(function(folder) {
    processFiles(path.join(platformPath, folder));
});

function processFiles(dir) {
    fs.readdir(dir, function (err, list) {
        if (err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = path.join(dir, file);
            fs.stat(file, function(err, stat) {
                if (recursiveFolderSearch && stat.isDirectory()) {
                    processFiles(file);
                } else{
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
            var result = UglifyJS.minify(res.src, hookConfig.uglifyJsOptions);
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
