#!/usr/bin/env node

/*jshint latedef:nofunc, node:true*/

// Modules
var fs = require('fs');
var path = require('path');
var dependencyPath = path.join(process.cwd(), 'node_modules');
// cordova-uglify module dependencies
var UglifyJS = require(path.join(dependencyPath, 'uglify-js'));
var CleanCSS = require(path.join(dependencyPath, 'clean-css'));
var ngAnnotate = require(path.join(dependencyPath, 'ng-annotate'));

// Process
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var cliCommand = process.env.CORDOVA_CMDLINE;

// Hook configuration
var configFilePath = path.join(rootDir, 'hooks/uglify-config.json');
var hookConfig = JSON.parse(fs.readFileSync(configFilePath));
var isRelease = hookConfig.alwaysRun || (cliCommand.indexOf('--release') > -1);
var recursiveFolderSearch = hookConfig.recursiveFolderSearch; // set this to false to manually indicate the folders to process
var foldersToProcess = hookConfig.foldersToProcess; // add other www folders in here if needed (ex. js/controllers)
var cssMinifier = new CleanCSS(hookConfig.cleanCssOptions);

// Exit
if (!isRelease) {
  return;
}

// Run uglifier
run();

/**
 * Run compression for all specified platforms.
 * @return {undefined}
 */
function run() {
  platforms.forEach(function(platform) {
    var wwwPath;

    switch (platform) {
      case 'android':
        wwwPath = path.join(platformPath, platform, 'assets', 'www');
        break;

      case 'ios':
      case 'browser':
      case 'wp8':
      case 'windows':
        wwwPath = path.join(platformPath, platform, 'www');
        break;

      default:
        console.log('this hook only supports android, ios, wp8, windows, and browser currently');
        return;
    }

    processFolders(wwwPath, platform);
  });
}

/**
 * Processes defined folders.
 * @param  {string} wwwPath - Path to www directory
 * @return {undefined}
 */
function processFolders(wwwPath, platform) {
  foldersToProcess.forEach(function(folder) {
    processFiles(path.join(wwwPath, folder, platform));
  });
}

/**
 * Processes files in directories.
 * @param  {string} dir - Directory path
 * @return {undefined}
 */
function processFiles(dir,platform) {
  fs.readdir(dir, function(err, list) {
    if (err) {
      console.log('processFiles err: ' + err);

      return;
    }

    list.forEach(function(file) {
      file = path.join(dir, file);

      fs.stat(file, function(err, stat) {
        if (stat.isFile()) {
          compress(file, platform);

          return;
        }

        if (recursiveFolderSearch && stat.isDirectory()) {
          processFiles(file);

          return;
        }
      });
    });
  });
}

/**
 * Compresses file.
 * @param  {string} file - File path
 * @return {undefined}
 */
function compress(file, platform) {
  var ext = path.extname(file),
    res,
    source,
    result,
    bomHelper = "windows" === platform ? "\xEF\xBB\xBF" : "";

  switch (ext) {
    case '.js':
      console.log('uglifying js file ' + file);

      res = ngAnnotate(String(fs.readFileSync(file)), {
        add: true
      });
      result = UglifyJS.minify(res.src, hookConfig.uglifyJsOptions);
      fs.writeFileSync(file, bomHepler + result.code, 'utf8'); // overwrite the original unminified file
      break;

    case '.css':
      console.log('minifying css file ' + file);

      source = fs.readFileSync(file, 'utf8');
      result = cssMinifier.minify(source);
      fs.writeFileSync(file, bomHepler + result.styles, 'utf8'); // overwrite the original unminified file
      break;

    default:
      console.log('encountered a ' + ext + ' file, not compressing it');
      break;
  }
}
