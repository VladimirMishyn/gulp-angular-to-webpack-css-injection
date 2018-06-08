# gulp-angular-to-webpack-css-injection

[![N|Solid](https://user-images.githubusercontent.com/35331661/37280452-2062eaa8-25ee-11e8-9546-0bdfec1c472f.png)](https://webpack.js.org/)

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
    
And [Gulp] deals with your style files simply by concatenaiting them and injecting in `index.html` as `<link rel=stylesheet href=styles/app.css>`.
In [Webpack] you should handle styles by yourself, importing them where needed.
In our project there are a lot of styles files that are in the directory with the corresponding component. It would take a long time to manually import styles into each file. Therefore, it was necessary to solve the optimization problem, for which the module was written.
```diff
- NOTICE: works only for for next file namings style:
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
const addCssImportsToJs = require('gulp-angular-to-webpack-css-injection');
```
And run it 
```
addCssImportsToJs('src/app');
```
Function signature:
```
//**
 * @param definedPath - string, your application folder, default 'src/app'
 * @param angularJsEntitiesArray - array, default ['component', 'controller',   *'module']
 */
module.exports = (definedPath, angularJsEntitiesArray) => {
//code
};
```
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

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   [Webpack]: <https://webpack.js.org/>
   [generator-gulp-angular]: <https://github.com/Swiip/generator-gulp-angular>
