const vscode = require('vscode');
var fs = require('fs');


const { extensionName } = require("./constants");

function getConfiguration(section) {
    return vscode.workspace.getConfiguration(extensionName).get(section)
}

function jsonReader(filePath, callBack) {
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

module.exports = {
    getConfiguration,
    jsonReader
  }
