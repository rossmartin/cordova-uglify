#!/usr/bin/env node

//After uninstall script to remove the uglify.js script from the users hooks/after_prepare directory

var fs = require('fs')
var path = require('path')
var cwd = process.cwd()

var uglifyJsPath = path.join(cwd, '../../', 'hooks', 'after_prepare', 'uglify.js')

fs.unlink(uglifyJsPath)
console.log('Removed: ', uglifyJsPath)