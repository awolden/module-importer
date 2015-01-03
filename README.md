Module Importer
===============

The module-importer is a fully featured tool for bulk loading modules. It provides support for loading modules locally (peer loading), including any other directory on the filesystem, filtering, and direct loading of individual modules.

The module-importer loads all specified modules into an object that has a collection of keys (keys are the filenames converted to camelcase) and the contents of each module. In addition each `imports` object has a property `imports._loadedModules` that contains more detailed information on every module loaded.

## Installation ##

    npm install module-importer

## Testing ##

This package has some built in tests to verify functionality.

    npm install --dev
    npm test

## Documentation/Usage ##

### Basic Usage ###

Basic Usage is very simple and straightforward. To load all local (peer) modules, all you have to do is `require('module-importer')` and instantiate the importer

```javascript
var Importer = require('module-import');

//load all local (peer) modules
var imports = new Importer();

if(!imports.error){
    //do something with loaded modules
}else{
    //handle error
}
```

### Accessing Details on Modules Loaded ###

Detailed information on what modules were loaded and where from you can access the `_loadedModules` property on imports

```javascript
if(!imports.error){
    console.log(imports._loadedModules)
}
```
### Advanced Options ###

To make full use of the module-importer you can pass an options object upon instantiation.

```javascript
//load all local (peer) modules
var imports = new Importer({
    //opts
});
```

### Available Options ###
* **includeLocal** `boolean` *Flag for including peer modules*
* **filter** `function|regex|string` *Filters out modules based on relative path to executing script*
* **includes** `Array[objects]` *Array of option objects that specifies where else to look for modules*  
     *Options Available for an include*
     * **_path_** `string` *Path of the file or folder to include. Can be relative or absolute.*
     * **_direct_** `bolean` *Indicates if the path should be loaded directly as a single module*
     * **_filter_** `(see above)`
* **localPath** `string` *Spoofs location path of executing script*
* **localFile** `string` *Spoofs file name of executing script*



### Code Examples ###

##### Basic Usage #####
```javascript
var Importer = require('module-import');

//load all local (peer) modules
var imports = new Importer();

if(!imports.error){
    //do something with loaded modules
}else{
    //handle error
}
```

##### Filtering Local Modules #####
```javascript

//load all local (peer) modules
var imports = new Importer({
    //only load models in current directory
    filter: /model/g
});

```

##### Don't load peer modules and include multiple folders #####
```javascript
//load all local (peer) modules
var imports = new Importer({
    includeLocal: false,
    includes:[{
        //load all controllers
        //that dont't start with dev
        path:'../controllers',
        filter: function(path){
            if(path.indexOf('dev') !== 0) return true;
        }
    },{
        //also load the authentication module
        path:'../lib/authentication',
        direct:true
    }]
});
```

## License ##
Copyright (c) 2015, Alexander Wolden  
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
* Neither the name of the <organization> nor the
names of its contributors may be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
