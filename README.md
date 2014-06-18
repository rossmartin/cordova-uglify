# cordova-uglify

Cordova hook that allows you to uglify or minify your apps JavaScript and CSS.

## Install
Install the following package below inside of your apps root folder.
```
npm install cordova-uglify
```
Go into the `node_modules/cordova-uglify` folder that is added and copy the `after_prepare` folder in it to your Cordova `hooks` folder in your apps root folder.

## Usage
Once you have this hook installed it will compress your apps JavaScript and CSS when you run a `cordova prepare <platform>` or `cordova build <platform>` command.  This hook does not change your assets that live in the root www folder; it will uglify the assets that get output to the platforms folder after a `prepare` or `build`.  [Take a look at this line in the hook to add more files to be minified if you want]().  By default the hook will uglify the JavaScript and CSS in the root `www/js` and `www/css` of your project.

## Requirements
Out of the box this hook requires Cordova 3.3.1-0.4.2 but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS.  This is becuase the `CORDOVA_PLATFORMS` environment variable was not added until version 3.3.1-0.4.2 ([see this post by Dan Moore](http://www.mooreds.com/wordpress/archives/1425)).

## License
MIT