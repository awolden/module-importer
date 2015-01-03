'use strict';

/* global describe, it, before, after */

var Importer = require('../index'),
    assert = require('chai').assert,
    expect = require('chai').expect;

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
        it('should load modules from included folder', function (done) {

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
        it('should apply regex filter', function (done) {


            //provide a local path override because this file gets executed in the context
            //of mocha
            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename,
                filter: /folder/g
            });

            var expectedModules = [{
                name: "moduleFolder",
                path: __dirname + "/module-folder"
            }];

            expect(imports._loadedModules).to.eql(expectedModules);

            done();
        });
        it('should apply function filter', function (done) {

            //provide a local path override because this file gets executed in the context
            //of mocha
            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename,
                filter: function (path) {
                    if (path.indexOf('folder') > -1) return true
                }
            });

            var expectedModules = [{
                name: "moduleFolder",
                path: __dirname + "/module-folder"
            }];

            expect(imports._loadedModules).to.eql(expectedModules);

            done();
        });
        it('should apply string filter', function (done) {

            //provide a local path override because this file gets executed in the context
            //of mocha
            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename,
                filter: "module-folder"
            });

            var expectedModules = [{
                name: "moduleFolder",
                path: __dirname + "/module-folder"
            }];

            expect(imports._loadedModules).to.eql(expectedModules);

            done();
        });
    });
    describe('Modules get loaded correctly', function () {
        it('Module Values match the value from require()', function (done) {

            var imports = new Importer({
                localPath: __dirname,
                localFile: __filename
            });

            expect(imports.moduleFile).to.eql(require('./module-file'));
            expect(imports.moduleFolder).to.eql(require('./module-folder'));

            done();
        });
    });
});