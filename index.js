const fs = require('fs');
const path = require('path');
const glob = require('glob');
const upathModule = require('upath');
const defaultEntitiesForInject = ['component', 'controller', 'module'];

const injectCssHere = (parsedPath) => {
    glob(parsedPath.dir + '/*.css', {}, (error, innerCssFiles) => {
        if (innerCssFiles.length > 0) {
            let jsFilePath = `${parsedPath.dir}/${parsedPath.base}`;
            innerCssFiles.forEach(css => {
                let cssNameToInject = `import './${path.basename(css)}';`;
                ((jsPath, inject) => {
                    fs.readFile(jsFilePath, 'utf8', (error, content) => {
                        if (!content.includes(inject)) {
                            let rewrite = `${inject}\n${content}`;
                            ((where, what, success) => {
                                fs.writeFile(where, what, (err) => {
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
module.exports = (definedPath, angularJsEntitiesArray) => {
    let pathString = (definedPath) ? definedPath : 'src/app';
    let entities = (angularJsEntitiesArray) ? angularJsEntitiesArray : defaultEntitiesForInject;
    injectionInPath(definedPath, entities);
};

