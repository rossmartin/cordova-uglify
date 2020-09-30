/*jshint latedef:nofunc, node:true*/
/* eslint-env node */

module.exports = function (ctx) {
    "use strict";

    var fs = require('fs'),
        path = require('path'),
        UglifyJS = require('uglify-js'),
        CleanCSS = require('clean-css'),
        ngAnnotate = require('ng-annotate'),
        rootDir = ctx.opts.projectRoot,
        platformPath = path.join(rootDir, 'platforms'),
        platforms = ctx.opts.cordova.platforms,
        cliCommand = ctx.cmdLine,
        configFilePath = path.join(rootDir, 'hooks/uglify-config.json'),
        hookConfig = JSON.parse(fs.readFileSync(configFilePath)),
        isRelease = hookConfig.alwaysRun || (cliCommand.indexOf('--release') > -1),
        recursiveFolderSearch = hookConfig.recursiveFolderSearch, // set this to false to manually indicate the folders to process
        foldersToProcess = hookConfig.foldersToProcess, // add other www folders in here if needed (ex. js/controllers)
        cssMinifier = new CleanCSS(hookConfig.cleanCssOptions);


    /**
     * Compresses file.
     * @param  {string} file - File path
     * @return {undefined}
     */
    function compress(file) {
        var ext = path.extname(file),
            res,
            source,
            result;

        switch (ext) {
        case '.js':
            console.log('uglifying js file ' + file);

            res = ngAnnotate(String(fs.readFileSync(file, 'utf8')), {
                add: true
            });
            result = UglifyJS.minify(res.src, hookConfig.uglifyJsOptions);
            fs.writeFileSync(file, result.code, 'utf8'); // overwrite the original unminified file
            break;

        case '.css':
            console.log('minifying css file ' + file);

            source = fs.readFileSync(file, 'utf8');
            result = cssMinifier.minify(source);
            fs.writeFileSync(file, result.styles, 'utf8'); // overwrite the original unminified file
            break;

        default:
            console.log('encountered a ' + ext + ' file, not compressing it');
            break;
        }
    }

    /**
     * Processes files in directories.
     * @param  {string} dir - Directory path
     * @return {undefined}
     */
    function processFiles(dir) {
        fs.readdir(dir, function (err, list) {
            if (err) {
                console.log('processFiles err: ' + err);

                return;
            }

            list.forEach(function (file) {
                file = path.join(dir, file);

                fs.stat(file, function (err, stat) {
                    if (stat.isFile()) {
                        compress(file);
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
     * Processes defined folders.
     * @param  {string} wwwPath - Path to www directory
     * @return {undefined}
     */
    function processFolders(wwwPath) {
        foldersToProcess.forEach(function (folder) {
            processFiles(path.join(wwwPath, folder));
        });
    }
    
    
    if (!isRelease) {
        return;
    }
    
    platforms.forEach(function (platform) {
        var wwwPath;

        switch (platform) {
        case 'android':
            wwwPath = path.join(platformPath, platform, 'assets', 'www');
            if (!fs.existsSync(wwwPath)) {
                wwwPath = path.join(platformPath, platform, 'app', 'src', 'main', 'assets', 'www');
            }
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

        processFolders(wwwPath);
    });
    
};