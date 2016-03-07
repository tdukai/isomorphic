"use strict";

const fs = require('fs');
const path = require('path');

module.exports = function folders (srcPath) {
    var result = fs.readdirSync(srcPath).filter(function(file) {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
    return result;
};