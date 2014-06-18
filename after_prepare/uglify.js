#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var compressor = require('yuicompressor');

var isRelease = true; // i always minify for debug or release. see below on how to minify only for release
/*
var isRelease = (process.env.RELEASE && process.env.RELEASE === '1');
// Turn this on only for release
if (isRelease !== true) {
    return;
}
*/
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;

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

processFiles(platformPath + '/js');
processFiles(platformPath + '/css');
// add other directories here if needed

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
    console.log('compressing file: ' + file + '\r\n');
    var ext = path.extname(file);
    compressor.compress(file, {
        type: ext,
        nomunge: false, // true to minify only (no obfuscate)
        charset: 'utf8'
    }, function(err, data, extra) {
        // overwrite the original unminified files
        fs.writeFileSync(file, data, 'utf8');
    });
}
