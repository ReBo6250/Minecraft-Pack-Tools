const vscode = require('vscode');
var fs = require('fs');
const { readdir } = require('fs').promises;


const { extensionName } = require("./constants");

function getConfiguration(section) {
    return vscode.workspace.getConfiguration(extensionName).get(section)
}

async function jsonReader(filePath, callBack) {
    fs.readFile(
        filePath,
        (error, fileData) => {
            if (error) { return callBack && callBack(error); }
            try {
                const object = JSON.parse(fileData);
                return callBack && callBack(null, object);
            }
            catch (error) {
                return callBack && callBack(error);
            }
        }
    );
};

function jsonConverter(object, indent = 2) {
    try {
        return JSON.stringify(object, (key, value) => {
            if (Array.isArray(value) && !value.some(x => x && typeof x === 'object')) {
                return `\uE000${JSON.stringify(value.map(v => typeof v === 'string' ? v.replace(/"/g, '\uE001') : v))}\uE000`;
            }
            return value;
        }, 
        indent).replace(/"\uE000([^\uE000]+)\uE000"/g, match => match.substr(2, match.length - 4).replace(/\\"/g, '"').replace(/\uE001/g, '\\\"'));
    } catch (error) {
        console.error('Error converting object to string:', error);
        return null;
    }
}



async function getFilesInFolder(parentFolderPath) {
    let filePaths = [];
    const files = await readdir(parentFolderPath, { withFileTypes: true });
  
    for (const file of files) {
        if (file.isDirectory()) { filePaths = [ ...filePaths, ...(await getFilesInFolder(`${parentFolderPath}/${file.name}`)), ];} 
        else { filePaths.push(`${parentFolderPath}/${file.name}`); }
    }
    return filePaths;
};

async function getFolders(parentFolderPath) {
    let folderPaths = [];
    const files = await readdir(parentFolderPath, { withFileTypes: true });
  
    for (const file of files) {
        if (file.isDirectory()) {
            folderPaths = [ ...folderPaths, ...(await getFolders(`${parentFolderPath}/${file.name}`)), ];
            folderPaths.push(`${parentFolderPath}/${file.name}`);
        } 
    }
    return folderPaths;
};

module.exports = {
    getFolders,
    getFilesInFolder,
    getConfiguration,
    jsonConverter,
    jsonReader
  }