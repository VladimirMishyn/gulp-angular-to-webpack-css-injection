const fs = require('fs');
const path = require('path');
const glob = require('glob');
const upathModule = require('upath');
const replaceInFile = require('replace-in-file');
const defaultEntitiesForInject = ['component', 'controller', 'module'];

const requireCssCode = `const context = require.context('./', true, /\.css/);\ncontext.keys().forEach(context);\n`;
const importCssRequireFile = `import "./styles.index.js";\n`;
const cssImportRegExpArray = [/import(.+)\.css';[^]/g, /import(.+)\.css";[^]/g];

// Import style processing
/*
* Injects import statements to js file
* @param parsedPath - path to js file
*/
const injectCssHere = (parsedPath) => {
    glob(parsedPath.dir + '/*.css', {}, (error, innerCssFiles) => {
        if (innerCssFiles.length > 0) {
            let jsFilePath = `${parsedPath.dir}/${parsedPath.base}`;
            innerCssFiles.forEach(css => {
                let cssNameToInject = `import './${path.basename(css)}';`;
                ((jsPath, inject) => {
                    fs.readFile(jsPath, 'utf8', (error, content) => {
                        if (!content.includes(inject)) {
                            let rewrite = `${inject}\n${content}`;
                            ((where, what, success) => {
                                fs.writeFile(where, what, 'utf-8', (err) => {
                                    if (err) throw err;
                                    console.log(`${success} in ${where} SUCCESS`);
                                });
                            })(jsPath, rewrite, inject);
                        }
                    });
                })(jsFilePath, cssNameToInject);
            });
        }
    })
}

/*
* Selects files for import statement injection
* @param definedPath - path to source, used for glob match
* @param entities - angularJs entities for check
*/
const injectionInPath = (definedPath, entities) => {
    glob(definedPath + '/**/*.js', {}, (er, jsFiles) => {
        jsFiles.forEach(element => {
            let unixPath = upathModule.normalize(element);
            let parsedPath = path.parse(unixPath);
            if (parsedPath) {
                let splitName = parsedPath.name.split('.');
                if (splitName[1] && entities.indexOf(splitName[1]) >= 0) {
                    injectCssHere(parsedPath);
                }
            }
        });
    });
}

// Require style processing
/*
* Removes all css imports in folder files
* @param entryDir - entry directory
*/
const removeAllCssImports = (entryDir) => {
    let jsGlob = entryDir + '/**/*.js';
    let options = {
        files: jsGlob,
        encoding: 'utf8',
        from: cssImportRegExpArray,
        to: ''
    };
    try {
        const changes = replaceInFile.sync(options);
        if (changes.length > 0) {
            console.log('Modified files:', changes.join(', '));
        } else {
            console.log('Files not modified, 0 matches');
        }
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}

/*
* Add import of css-require to entry point
* @param entry 
*/
const addImportToEntry = (entry) => {
    fs.readFile(entry, 'utf8', (error, content) => {
        if (!content.includes(importCssRequireFile)) {
            let rewrite = `${importCssRequireFile}\n${content}`;
            fs.writeFile(entry, rewrite, 'utf8', (err) => {
                if (err) throw err;
                console.log(`import added to entry point`);
            });
        }
    });
}

/*
* Creates file with css require using context
* @param entry 
* @param removeImports - boolean - remove import css statements in folder if needed 
*/
const useRequireContext = (entry, removeImports) => {
    let unixPath = upathModule.normalize(entry);
    let parsedPath = path.parse(unixPath);
    let styles = parsedPath.dir + '/styles.index.js';
    if (!fs.existsSync(styles)) {
        if (removeImports) {
            removeAllCssImports(parsedPath.dir);
        }
        fs.writeFile(styles, requireCssCode, 'utf8', (err) => {
            if (err) throw err;
            console.log(`${styles} saved`);
            addImportToEntry(entry);
        });
    } else {
        console.log(`${styles} file already exists! No replaces were processed!`);
    }
};

/*
* Public interface for injecting import css
* @param definedPath - string, your application folder, default 'src/app'
* @param angularJsEntitiesArray - array, default ['component', 'controller', 'module']
*/
const useImports = (definedPath, angularJsEntitiesArray) => {
    let pathString = (definedPath) ? definedPath : 'src/app';
    let entities = (angularJsEntitiesArray) ? angularJsEntitiesArray : defaultEntitiesForInject;
    injectionInPath(definedPath, entities);
};

/*
* Public interface for creating and adding require css to your project
* @param entryPoint - string, entry point of your application
* @param removeImports - boolean - remove import css statements in folder if needed
*/
const useRequire = (entryPoint, removeImports = false) => {
    let entry = (entryPoint) ? entryPoint : 'src/app/index.module.js';
    useRequireContext(entry, removeImports);
}

module.exports.useImports = useImports;
module.exports.useRequire = useRequire;