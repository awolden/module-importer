'use strict';

var Importer = require('../index');

//todo: tests

console.log("importting");

var opts = {
    includes: [{
        path: "./includeFolder",
    }, {
        path: "../node_modules/underscore",
        direct: true
    }]
};

var imports = new Importer(opts);

if (imports.error) {
    console.log("There was an error -> ", imports.error);
}

//console.log("require test -> ", require('./nonModuleFile'))