const vscode = require('vscode');
const  { PackWorkspace } = require('./packWorkspace');

const { commandStartServer, commandStopServer, commandCreateBpManifest, commandCreateRpManifest, commandCreateBpRpManifest, commandListSoundFiles, commandCreateScriptAPIManifest, commandCreateMcfunction } = require("./constants");

var AutoReloader = require("./autoReloader");

module.exports = {
	activate, deactivate
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	let packWorkspace = new PackWorkspace();
	packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
	
	let bpManifestDisposable = vscode.commands.registerCommand(commandCreateBpManifest, () => { packWorkspace.createBpManifest(); });
	let rpManifestDisposable = vscode.commands.registerCommand(commandCreateRpManifest, () => { packWorkspace.createRpManifest(); });
	let bpRpManifestDisposable = vscode.commands.registerCommand(commandCreateBpRpManifest, () => { packWorkspace.createBpRpManifest(); });
	let scriptAPIManifestDisposable = vscode.commands.registerCommand(commandCreateScriptAPIManifest, () => { packWorkspace.createScriptAPIManifest(); });
	let mcfunctionDisposable = vscode.commands.registerCommand(commandCreateMcfunction, () => { packWorkspace.createMcfunctionFromHighlightedText(); });
	let listSoundFilesDisposable = vscode.commands.registerCommand(commandListSoundFiles, () => { packWorkspace.listFilesInDirectory(); });

	let onDidChangeWorkspaceFoldersDisposable = vscode.workspace.onDidChangeWorkspaceFolders(
		() => { 
			packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
		}
	);

	let onDidSaveTextDocumentDisposable = vscode.workspace.onDidSaveTextDocument(
		() => { 
			packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
			packWorkspace.renameFiles(); 
		}
	);
	let onDidCreateFilesDisposable = vscode.workspace.onDidCreateFiles(
		() => { 
			packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
			packWorkspace.renameFiles(); 
		}
	);
	let onDidRenameFilesDisposable = vscode.workspace.onDidRenameFiles(
		() => { 
			packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
			packWorkspace.renameFiles(); 
		}
	);
	let onDidDeleteFilesDisposable = vscode.workspace.onDidDeleteFiles(
		() => { 
			packWorkspace.getPackWorkspaceInfo(vscode.workspace.workspaceFolders);
			packWorkspace.renameFiles(); 
		}
	);

	const autoReloader = new AutoReloader();
    const commandStartServerDisposable = vscode.commands.registerCommand(commandStartServer, () => autoReloader.start() );
    const commandStopServerDisposable = vscode.commands.registerCommand(commandStopServer, () => autoReloader.stop() );
	
    context.subscriptions.concat(autoReloader, commandStartServerDisposable, commandStopServerDisposable);
	context.subscriptions.push(
		bpManifestDisposable,
		rpManifestDisposable,
		listSoundFilesDisposable,
		bpRpManifestDisposable,
		onDidSaveTextDocumentDisposable, 
		onDidDeleteFilesDisposable, 
		onDidChangeWorkspaceFoldersDisposable, 
		onDidCreateFilesDisposable, 
		onDidRenameFilesDisposable,
		scriptAPIManifestDisposable,
		mcfunctionDisposable
	);
}

function deactivate() {}