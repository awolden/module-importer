'use strict';

/*
 * Builds the constructor function that is passed upon module instantiation.
 */

var utils = require('./utils')


function Constructor(opts) {

    var self = this,
        currentFileInfo = [],
        fileTokens = [],
        fileName = "",
        returnObj = {},
        modules = null,
        defaults = {
            includeLocal: true,
            filter: null,
            includes: []
        };

    //apply default opts
    opts = opts || {};
    opts = utils._extend(defaults, opts);

    //get context filename and directory
    fileName = opts.localFile || require.main.filename;
    fileTokens = fileName.split("/");
    currentFileInfo.file = fileTokens[fileTokens.length - 1];
    currentFileInfo.directory = opts.localPath || require('path').dirname(require.main.filename);

    //get all modules
    try {
        modules = utils._listModules(opts, currentFileInfo);
    }
    catch (err) {
        return {
            error: err
        };
    }

    //Transform Modules Names
    try {
        modules = utils._transformNames(modules);
    }
    catch (err) {
        return {
            error: err
        };
    }

    //loadModules
    try {
        returnObj = utils._loadModules(modules);
    }
    catch (err) {
        return {
            error: err
        };
    }

    return returnObj;

}



module.exports = Constructor;