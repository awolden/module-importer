'use strict';

/*
 * Builds the constructor function that is passed upon module instantiation.
 */
var utils = require('./utils')


function Constructor(opts) {

    var self = this,
        currentFileInfo = [],
        fileTokens = [],
        returnObj = {},
        modules = null,
        defaults = {
            includeLocal: true,
            filter: null,
            includes: []
        };

    //get context filename to prevent us from trying to import it
    fileTokens = require.main.filename.split("/");
    currentFileInfo.file = fileTokens[fileTokens.length - 1];
    currentFileInfo.directory = require('path').dirname(require.main.filename);

    //apply default opts
    opts = opts || {};
    opts = utils._extend(defaults, opts);

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
        console.log("module list ->", modules);
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