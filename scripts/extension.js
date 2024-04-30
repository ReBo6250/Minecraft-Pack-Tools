const MPT = require("./MPT");
const vscode = require("vscode");


function activate(context) {
    const mpt = new MPT();
  
    context.subscriptions.push(mpt);
}
exports.activate = activate;

function deactivate() {}
