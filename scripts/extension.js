const MptWorkspace = require("./mpt");
const vscode = require("vscode");


function activate() {
    new MptWorkspace();
  

}
exports.activate = activate;

function deactivate() {}
