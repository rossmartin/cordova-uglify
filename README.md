# cordova-uglify

Cordova hook that allows you to uglify or minify your apps JavaScript and CSS.  It is using [UglifyJS2](https://github.com/mishoo/UglifyJS2) for JavaScript compression and [clean-css](https://github.com/GoalSmashers/clean-css) to minify CSS.  The hook also supports compressing your apps images using [imagemin](https://github.com/imagemin/imagemin).

## Install
Install the following package below inside of your apps root folder.
```
npm install cordova-uglify
```
After install an `after_prepare` folder will be added to your `hooks` folder with the `uglify.js` script in it.  A JSON config file (`uglify-config.json`) for the script will be added to the `hooks` folder.

## Usage
Once you have this hook installed it will compress your apps JavaScript and CSS when you run a `cordova prepare <platform>` or `cordova build <platform>` command.  This hook does not change your assets that live in the root www folder; it will uglify the assets that get output to the platforms folder after a `prepare` or `build`.  By default the hook will uglify the JavaScript and minify CSS files by recursively searching your projects www folder.  You can disable the recursive search by setting the `recursiveFolderSearch` to `false` in the JSON config file.  If you want to process files only when building/preparing for release include `--release` in your CLI command like this - `cordova prepare ios --release`.

## Configuration
```javascript
{
  "alwaysRun": false, // set to true to always uglify files
  "recursiveFolderSearch": true, // process all JS and CSS files found in www
  "foldersToProcess": [ // when recursiveFolderSearch is set to false only files in these directories will be processed
    "js",
    "css",
    "img"
  ],
  "uglifyJsOptions": { // pass options to UglifyJS2 (you can include more than these below)
    "compress": {
      "drop_console": true
    },
    "fromString": true
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

## Requirements
Out of the box this hook requires Cordova 3.3.1-0.4.2 and above but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS.  This is becuase the `CORDOVA_PLATFORMS` environment variable was not added until version 3.3.1-0.4.2 ([see this post by Dan Moore](http://www.mooreds.com/wordpress/archives/1425)).

I came across a quirk on OSX and Linux where the `hooks` folder needs to have permissions modified.  Perform a `chmod -R 755 hooks` to resolve this issue.

## Future Development
* HTML compression

## License
[MIT](https://github.com/rossmartin/cordova-uglify/blob/master/LICENSE)