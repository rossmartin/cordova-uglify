# cordova-uglify

Cordova hook that allows you to uglify or minify your apps JavaScript and CSS.  It is using [UglifyJS2](https://github.com/mishoo/UglifyJS2) for JavaScript compression and [clean-css](https://github.com/GoalSmashers/clean-css) to minify CSS.  The hook also supports compressing your apps images using [imagemin](https://github.com/imagemin/imagemin).

## Install
Install the following package below inside of your apps root folder.
```
npm install cordova-uglify --legacy-bundling
```
After install an `after_prepare` folder will be added to your `hooks` folder with the `uglify.js` script in it.  A JSON config file (`uglify-config.json`) for the script will be added to the `hooks` folder.  The hook will automatically be given executable permission.

## Usage
Once you have this hook installed it will compress your apps JavaScript and CSS when you run a `cordova prepare <platform>` or `cordova build <platform>` command.  This hook does not change your assets that live in the root www folder; it will uglify the assets that get output to the platforms folder after a `prepare` or `build`.  By default the hook will uglify the JavaScript and minify CSS files by recursively searching the folders provided in the `foldersToProcess` in the `uglify-config.json` (relative to your project root directory).  You can disable the recursive search by setting the `recursiveFolderSearch` to `false` in the JSON config file.  If you want to process files only when building/preparing for release include `--release` in your CLI command like this - `cordova prepare ios --release`.  Please see the note below about usage with Ionic 2.

## Configuration
```javascript
{
  "alwaysRun": false, // set to true to always uglify files
  "recursiveFolderSearch": true, // process all JS and CSS files found in foldersToProcess
  "foldersToProcess": [ // when recursiveFolderSearch is set to false only files in these directories will be processed
    "js",
    "css",
    "img",
    "build" // this is needed for Ionic 2 projects
  ],
  "uglifyJsOptions": { // pass options to UglifyJS2 (you can include more than these below)
    "compress": {
      "drop_console": true
    },
    "fromString": true,
    "mangle": true // set this to false for Ionic 2 projects
  },
  "cleanCssOptions": { // pass options to CleanCSS (you can include more than these below)
    "noAdvanced": true,
    "keepSpecialComments": 0
  },
  "imageminOptions": { // pass options to imagemin (you can include more than these below)
    "jpeg": {
      "progressive": true,
      "arithmetic": false
    },
    "png": {
      "optimizationLevel": 2
    },
    "gif": {
      "interlaced": false
    },
    "svg": {
      "pretty": false
    }
  }
}
```

You can disable the image compression by removing the `imageminOptions` key in the `uglify-config.json`.

## Using cordova-uglify with Ionic 2
Ionic 2 projects require a couple changes to the `uglify-config.json`.
* Add `build` to the `foldersToProcess` property.
* Set `mangle` to `false` in the `uglifyJsOptions`.

## Requirements
Out of the box this hook requires Cordova 3.3.1-0.4.2 and above but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS.  This is because the `CORDOVA_PLATFORMS` environment variable was not added until version 3.3.1-0.4.2 ([see this post by Dan Moore](http://www.mooreds.com/wordpress/archives/1425)).

## Future Development
* HTML compression

## License
[MIT](https://github.com/rossmartin/cordova-uglify/blob/master/LICENSE)
