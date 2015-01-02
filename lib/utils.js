'use strict';

/*
 * This module contains all utility functions for the module-importer
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    self = {};



/*
 * Returns an array of all files and folders that will need
 * to be required by the contstructor
 * @param {Object} opts Options for importing.
 * @param {Object} Information on execution context
 * @returns {Array} String aray of module paths
 */
self._listModules = function (opts, current) {

    var moduleList = [];

    if (!opts) {
        throw new Error('No Options Provided to utils._listModules');
    }

    console.log("iteration ->", opts, current);
    console.log("====================");

    //traverse the directory and import all the modules in it
    if (opts.includeLocal || (opts.isInclude && !opts.direct)) {

        fs.readdirSync(opts.includePath || current.directory).forEach(function (file) {
            if (file === current.file) return false;

            var modulePath = false,
                filePath = path.resolve(current.directory, opts.includePath || "", file);

            //use require.resolve to test if require can resolve the file
            //NOTE: doesn't test whether or the module actually exports anything
            //throws an error if it isn't a valid module
            try {
                modulePath = require.resolve(filePath);
            }
            catch (err) {
                return false;
            }

            if (modulePath) {
                moduleList.push(modulePath);
            }
            else {
                return false;
            }

        });

    }
    //this is a direct import
    //can only happen as an include
    else if (opts.isInclude && opts.direct) {
        var modulePath = false,
            fullPath = path.resolve(current.directory, opts.includePath);

        try {
            modulePath = require.resolve(fullPath);
        }
        catch (err) {
            return false;
        }

        if (modulePath) {
            moduleList.push(fullPath);
        }
        else {
            return false;
        }
    }

    //handle includes
    //makes a rescursive call to self._listModules
    if (opts.includes) {

        opts.includes.forEach(function (include) {

            var fullPath = path.resolve(current.directory, include.path),
                pathStat = fs.lstatSync(fullPath);

            if (pathStat.isDirectory()) {

                //make a recursive call to get the module list for this folder
                moduleList = _.union(moduleList, self._listModules({
                    isInclude: true,
                    includePath: fullPath,
                    direct: include.direct,
                    filter: include.filter
                }, current));

            }
            else if (pathStat.isFile()) {
                var modulePath = false;

                try {
                    modulePath = require.resolve(fullPath);
                }
                catch (err) {
                    return false;
                }

                if (modulePath) {
                    moduleList.push(fullPath);
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Include path " + include.path + " is not a valid path.");
            }

        });
    }

    return moduleList;
};


/*
 * Transforms filenames to be valid object properties
 * _ and - are removed and file is converted to camelcase
 * @param moduleList List of modules to be imported.
 * @returns {Array} Array of objects, each containing ModuleName and ModulePath
 */
self._transformNames = function (moduleList) {

    if (!Array.isArray(moduleList)) {
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
self._loadModules = function (moduleList) {

    if (!moduleList) {
        //throw new Error('No File list provided to utils._transformNames');
    }

    //todo: load modules

};


/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 * @returns {Object} New Object
 */
self._extend = function (a, b) {
    var n;
    if (!a) {
        a = {};
    }
    for (n in b) {
        a[n] = b[n];
    }
    return a;
};

module.exports = self;