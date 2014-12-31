'use strict';

/*
 * Builds the constructor function that is passed upon module instantiation.
 */
var utils = require('./utils')


function Constructor(opts) {

    var self = this,
        cwd = require('path').dirname(require.main.filename),
        returnObj = {},
        modules = null,
        defaults = {
            includeLocal: true,
            depth: 1,
            includes: [],
            excludes: []
        };

    //apply default opts
    opts = utils.extend(defaults, opts);

    //get all modules
    try {
        modules = utils._listModules(opts, cwd);
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