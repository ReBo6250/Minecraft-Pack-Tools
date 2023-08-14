const vscode = require('vscode');
var fs = require('fs');
const { readdir } = require('fs').promises;


const { extensionName } = require("./constants");

function getConfiguration(section) {
    return vscode.workspace.getConfiguration(extensionName).get(section)
}

function jsonReader(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(parseError);
          }
        }
      });
    });
  }

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
function createDirectories(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
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
    getConfiguration,
    getFilesInFolder,
    getFolders,
    createDirectories,
    jsonConverter,
    jsonReader
  }