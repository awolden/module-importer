'use strict';

/*
 * This module contains all utility functions for the module-importer
 */

var fs = require('fs');



/*
 * Returns an array of all files and folders that will need
 * to be required by the contstructor
 * @param {Object} opts Options for importing.
 * @param {String} cwd Directory in which the module is being used.
 * @returns {Array} String aray of module paths
 */
exports._listModules = function (opts, cwd) {

    if (!opts) {
        throw new Error('No Options Provided to utils._listModules');
    }

    //todo: list all files!

};


/*
 * Transforms filenames to be valid object properties
 * _ and - are removed and file is converted to camelcase
 * @param moduleList List of modules to be imported.
 * @returns {Array} Array of objects, each containing ModuleName and ModulePath
 */
exports._transformNames = function (moduleList) {

    if (!moduleList) {
        throw new Error('No File list provided to utils._transformNames');
    }

    //todo: transform all names

};


/*
 * Transforms filenames to be valid object properties
 * _ and - are removed and file is converted to camelcase
 * @param moduleList List of modules to be imported.
 * @returns {Array} Array of objects, each containing ModuleName and ModulePath
 */
exports._loadModules = function (moduleList) {

    if (!moduleList) {
        throw new Error('No File list provided to utils._transformNames');
    }

    //todo: load modules

};


/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 * @returns {Object} New Object
 */
exports.extend = function (a, b) {
    function extend(a, b) {
        var n;
        if (!a) {
            a = {};
        }
        for (n in b) {
            a[n] = b[n];
        }
        return a;
    }
};