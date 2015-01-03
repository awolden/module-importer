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

    //traverse the directory and import all the modules in it
    if (opts.includeLocal || (opts.isInclude && !opts.direct)) {

        var searchPath = opts.includePath || current.directory;

        fs.readdirSync(searchPath).forEach(function (file) {
            if (file === current.file) return false;

            var modulePath = false,
                fullPath = path.resolve(current.directory, opts.includePath || "", file),
                relativePath = path.relative(opts.includePath || "", file);

            //use require.resolve to test if require can resolve the file
            //NOTE: doesn't test whether or the module actually exports anything
            //throws an error if it isn't a valid module
            try {
                modulePath = require.resolve(fullPath);
            }
            catch (err) {
                return false;
            }

            if (modulePath && self._testFilter(opts.filter, relativePath)) {
                moduleList.push(fullPath);
            }
            else {
                return false;
            }

        });

    }
    //Direct Import of a Module (no filesystem scanning)
    //This can only happen as an include.
    else if (opts.isInclude && opts.direct) {
        var modulePath = false,
            fullPath = path.resolve(current.directory, opts.includePath);

        try {
            modulePath = require.resolve(fullPath);
        }
        catch (err) {
            return false;
        }

        if (modulePath && self._testFilter(opts.filter, opts.includePath)) {
            moduleList.push(fullPath);
        }
        else {
            return false;
        }
    }

    //Handle Includes
    //This makes a rescursive call to self._listModules.
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

                if (modulePath && self._testFilter(opts.filter, include.path)) {
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
 * Apply Filter
 * Tests a path to see if it passes the filter
 * @param filter Filter to be applied
 * @param path Path to be tested
 * @returns {Boolean}
 */
self._testFilter = function (filter, path) {

    if (!path) {
        throw new Error('_applyFilter is missing path information');
    }

    if (!filter) return true;

    //Filter is a regex
    if (filter instanceof RegExp) {
        return filter.test(path);
    }

    //Filter is a string
    if (typeof filter === 'string') {
        return path === filter;
    }

    //Filter is a function
    if (typeof filter === 'function') {
        return filter(path);
    }

};


/*
 * Transform filenames to be valid object properties
 * _ and - are removed and file is converted to camelcase
 * @param moduleList List of modules to be imported.
 * @returns {Array} Array of objects, each containing ModuleName and ModulePath
 */
self._transformNames = function (moduleList) {

    if (!Array.isArray(moduleList)) {
        throw new Error('No File list provided to utils._transformNames');
    }

    //map the module list
    return moduleList.map(function (modulePath) {
        var fileTokens = modulePath.split("/"),
            fileName = fileTokens[fileTokens.length - 1];

        return {
            path: modulePath,
            name: fileName.replace(/[-]([a-zA-Z])/g, function (m, w) {
                return w.toUpperCase();
            }).replace(/\.[^/.]+$/, "")
        }
    })

    //todo: transform all names

};


/*
 * Load Modules
 * _ and - are removed and file is converted to camelcase
 * @param moduleList List of modules to be imported.
 * @returns {Array} Array of objects, each containing ModuleName and ModulePath
 */
self._loadModules = function (moduleList) {

    var modules = {};

    if (!Array.isArray(moduleList)) {
        throw new Error('No File list provided to utils._loadModules');
    }

    moduleList = moduleList.filter(function (moduleDetails) {

        var module = {};

        //try to load module
        try {
            module = require(moduleDetails.path);
        }
        catch (err) {
            return false;
        }

        //test to see if module exported anything
        //a non-module file will import an empty object
        //so if there is anything other than an empty object
        //we can assume the import was successful.
        switch (typeof module) {
        case "string":
        case "number":
        case "function":
        case "symbol":
        case "boolean":
            modules[moduleDetails.name] = module;
            return true;
        case "object":
            if (!_.isEmpty(module)) {
                modules[moduleDetails.name] = module;
                return true;
            }
            break;
        }

    });

    modules._loadedModules = moduleList;
    return modules;

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