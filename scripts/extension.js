const vscode = require('vscode');
<<<<<<< Updated upstream
const vsCommand = require('./vsCommand');
const packFolders = require('./packFolders');
const rename = require('./rename');

module.exports = {
	activate,
	deactivate
=======
const  { PackWorkspace } = require('./packWorkspace');

const { commandStartServer, commandStopServer, commandCreateBpManifest, commandCreateRpManifest, commandCreateBpRpManifest, commandCreateScriptAPIManifest } = require("./constants");

var AutoReloader = require("./autoReloader");

module.exports = {
	activate, deactivate
>>>>>>> Stashed changes
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
<<<<<<< Updated upstream
	packFolders.checkManifests();
=======
	let packWorkspace = new PackWorkspace();
	packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
>>>>>>> Stashed changes

	let bpManifestDisposable = vscode.commands.registerCommand(commandCreateBpManifest, () => { packWorkspace.createBpManifest(); });
	let rpManifestDisposable = vscode.commands.registerCommand(commandCreateRpManifest, () => { packWorkspace.createRpManifest(); });
	let bpRpManifestDisposable = vscode.commands.registerCommand(commandCreateBpRpManifest, () => { packWorkspace.createBpRpManifest(); });
	let scriptAPIManifestDisposable = vscode.commands.registerCommand(commandCreateScriptAPIManifest, () => { packWorkspace.createScriptAPIManifest(); });

<<<<<<< Updated upstream
	let onDidChangeWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(() => { packFolders.checkPackFolders(); });
=======
	let onDidChangeWorkspaceFoldersDisposable = vscode.workspace.onDidChangeWorkspaceFolders(() => { packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);});
>>>>>>> Stashed changes

	let onDidSaveTextDocumentDisposable = vscode.workspace.onDidSaveTextDocument(() => { packWorkspace.renameFiles(); });
	let onDidCreateFilesDisposable = vscode.workspace.onDidCreateFiles(() => { packWorkspace.renameFiles(); });
	let onDidRenameFilesDisposable = vscode.workspace.onDidRenameFiles(() => { packWorkspace.renameFiles(); });

<<<<<<< Updated upstream

	function renameFiles() {
		rename.filesInFolder(global.bpeFolderPath, '.json', '.bpe'); 
		rename.filesInFolder(global.bpaFolderPath, '.json', '.bpa');
		rename.filesInFolder(global.bpacFolderPath, '.json', '.bpac');
		rename.filesInFolder(global.bpiFolderPath, '.json', '.bpi');
		rename.filesInFolder(global.bpLootTableFolderPath, '.json', '.loot');
		rename.filesInFolder(global.bpDialogueFolderPath, '.json', '.dialogue');
		rename.filesInFolder(global.bpTradingFolderPath, '.json', '.trade');
		rename.filesInFolder(global.bpRecipeFolderPath, '.json', '.r');
		rename.filesInFolder(global.bpFunctionFolderPath, '.mcfunction', '');
		
		rename.filesInFolder(global.rpacFolderPath, '.json', '.rpac');
		rename.filesInFolder(global.rpaFolderPath, '.json', '.rpa');
		rename.filesInFolder(global.rpAttachableFolderPath, '.json', '.at');
		rename.filesInFolder(global.rpeFolderPath, '.json', '.rpe');
		rename.filesInFolder(global.rpiFolderPath, '.json', '.rpi');
		rename.filesInFolder(global.rpModelFolderPath, '.json', '.geo');
		rename.filesInFolder(global.rpParticleFolderPath, '.json', '.particle');
	}
	context.subscriptions.push( bpManifest, rpManifest, bpRpManifest, onDidSaveTextDocument, onDidChangeWorkspaceFolders, onDidCreateFiles, onDidRenameFiles, scriptAPIManifest);
=======
	const autoReloader = new AutoReloader();
    const commandStartServerDisposable = vscode.commands.registerCommand(commandStartServer, () =>
        autoReloader.start()
    );
    const commandStopServerDisposable = vscode.commands.registerCommand(commandStopServer, () =>
        autoReloader.stop()
    );
    context.subscriptions.concat(autoReloader, commandStartServerDisposable, commandStopServerDisposable);
	context.subscriptions.push(bpManifestDisposable, rpManifestDisposable, bpRpManifestDisposable, onDidSaveTextDocumentDisposable, onDidChangeWorkspaceFoldersDisposable, onDidCreateFilesDisposable, onDidRenameFilesDisposable, scriptAPIManifestDisposable);
>>>>>>> Stashed changes
}

function deactivate() {}
