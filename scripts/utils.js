const vscode = require('vscode');


function getConfiguration(section) {
    return vscode.workspace.getConfiguration(global.extensionName).get(section);
}

module.exports = {
    getConfiguration
  }
