'use strict';

/* global describe, it, before, after */

var Importer = require('../index'),
    assert = require('chai').assert,
    expect = require('chai').expect;



before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('Test Functionality', function () {
    describe('Loads correct modules', function () {
        it('should load all local modules', function (done) {

            //provide a local path override because this file gets executed in the context
            //of mocha
            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename
            });

            var expectedModules = [{
                name: "moduleFile",
                path: __dirname + "/module-file.js"
            }, {
                name: "moduleFolder",
                path: __dirname + "/module-folder"
            }];

            expect(imports._loadedModules).to.eql(expectedModules);

            done();
        });
        it('should load included modules', function (done) {

            //provide a local path override because this file gets executed in the context
            //of mocha
            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename,
                includeLocal: false,
                includes: [{
                    path: "./includeFolder"
                }]
            });

            var expectedModules = [{
                name: "includeModuleFile",
                path: __dirname + "/includeFolder/include-module-file.js"
            }, {
                name: "includeModuleFolder",
                path: __dirname + "/includeFolder/include-module-folder"
            }];

            expect(imports._loadedModules).to.eql(expectedModules);

            done();
        });
        it.skip('should apply filters', function (done) {
            done();
        });
    });
    describe('Modules get loaded correctly', function () {
        it.skip('Module Values match the value from require()', function (done) {
            done();
        });
    });
});




// var opts = {
//     includes: [{
//         path: "./includeFolder",
//     }, {
//         path: "../node_modules/underscore",
//         direct: true
//     }]
// };
//
// var imports = new Importer(opts);
//
// if (imports.error) {
//     console.log("There was an error -> ", imports.error);
// }
//
// //console.log("require test -> ", require('./nonModuleFile'))