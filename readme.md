# gulp-angular-to-webpack-css-injection

[![N|Solid](https://user-images.githubusercontent.com/35331661/37280452-2062eaa8-25ee-11e8-9546-0bdfec1c472f.png)](https://webpack.js.org/)


# Important notice
This module works, and sometimes it's helpful to have visiual representation of your css imports, according to your components. But it can be easily repalced by Webpack out of box functionality ```require.context```. Following code in your entry point does the thing:
```
const context = require.context('./', true, /\.css/); // true - include subdirctories
context.keys().forEach(context);
```
However, this module can also handle this approach
# Description:
If you (like many of us) used [generator-gulp-angular] to scaffold your application, and desperate willing to switch to Webpack builder, sooner or later you will bump in *.css imports trouble.

[generator-gulp-angular] creates next folder structure (simplified):

                 
    ├── src                     
    │   ├── app
    │   │  ├── main
    │   │  │    ├── main.controller.js
    │   │  │    ├── main.html
    │   │  │    ├── main.css
    │   │  ├── index.config.js
    │   │  ├── index.css
    │   │  ├── index.module.js
    │   │  ├── index.route.js
    │   │  ├── index.run.js
    │   ├── assets         
    │   └── index.html
    ├── bower.json
    ├── package.json
    └── gulpfile.js
    
And [Gulp] deals with your style files simply by concatenaiting them and injecting in `index.html` as `<link rel="stylesheet" href="styles/app.css">`.
In [Webpack] you should handle styles by yourself, importing them where needed.
In our project there are a lot of styles files that are in the directory with the corresponding component. It would take a long time to manually import styles into each file. Therefore, it was necessary to solve the optimization problem, for which the module was written.

Works in two ways: **add imports to files** or **add file with require.context to your entry point**
```diff
- NOTICE: First approach works only for next file namings style:
%name%.controller.js
%name%.component.js
%name%.module.js
etc.
```
You can provide your entities array, and pass them into module.

### Installation
Module requires [Node.js](https://nodejs.org/) to run. Was tested with nodejs 8.11.1, and npm 5.6.0.

Install module as dev dependency via npm.

```sh
$ npm install --save-dev gulp-angular-to-webpack-css-injection
```

Require it in your Webpack configuration code or anywhere:
```
const cssInjection = require('gulp-angular-to-webpack-css-injection');
```
And run it:
**Add imports to files** 
```
cssInjection.useImports('src/app');
```
Function signature:
```
/*
* Public interface for injecting import css
* @param definedPath - string, your application folder, default 'src/app'
* @param angularJsEntitiesArray - array, default: ['component', 'controller', 'module']
*/
module.exports.useImports = (definedPath, angularJsEntitiesArray) => {
//code
};
```
**Add import of require file to your entry point** 
```
cssInjection.useRequire('src/app/index.module.js', false);
```
Function signature:
```
/*
* Public interface for creating and adding require css file to your project
* @param entryPoint - string, entry point of your application
* @param removeImports - boolean - remove import css statements in folder if needed
*/
module.exports.useRequire = (entryPoint, removeImports = false) => {
//code
};
```
*Use with caution:* `removeImports = true` will remove all `import '%name%.css';` and `import "%name%.css";` from your source files.
May be helpful if you are using [extract-text-webpack-plugin].
Since [extract-text-webpack-plugin] only merges text chunks, some CSS duplication may occur.
### Result
Your source code changed from:
```
export class MainController {
  constructor ($state) {
    'ngInject';
  }
}
```
To:
```
import './main.css';
export class MainController {
  constructor ($state) {
    'ngInject';
  }
}
```
For future Webpack bundling flow.

Or, after using **useRequire**: `styles.index.js` created and imported to your entry point;

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   [Webpack]: <https://webpack.js.org/>
   [generator-gulp-angular]: <https://github.com/Swiip/generator-gulp-angular>
   [extract-text-webpack-plugin]: <https://www.npmjs.com/package/extract-text-webpack-plugin>
