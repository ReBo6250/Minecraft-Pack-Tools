const vscode = require('vscode');
const vsCommand = require('./vsCommand');
const rename = require('./rename');
const workspace = require('./workspace');
const {getConfiguration} = require('./utils');

const { startServerCommand, stopServerCommand } = require("./constants");

var AutoReloader = require("./autoReloader");

module.exports = {
	activate,
}
async function activate(context) {
	workspace.getPackFolders();

	let bpManifest = vscode.commands.registerCommand('minecraft-pack-tools.bpManifest', () => { vsCommand.createBpManifest(); });
	let rpManifest = vscode.commands.registerCommand('minecraft-pack-tools.rpManifest', () => { vsCommand.createRpManifest(); });
	let bpRpManifest = vscode.commands.registerCommand('minecraft-pack-tools.bpRpManifest', () => { vsCommand.createBpRpManifest(); });
	let scriptAPIManifest = vscode.commands.registerCommand('minecraft-pack-tools.scriptAPIManifest', () => { vsCommand.createScriptAPIManifest(); });

	let onDidChangeWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(() => { workspace.getPackFolders(); });

	let onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(() => { 
		renameFiles();
	});
	let onDidCreateFiles = vscode.workspace.onDidCreateFiles(() => { 
		renameFiles();
	});
	let onDidRenameFiles = vscode.workspace.onDidRenameFiles(() => { 
		renameFiles();
	});

	const autoReloader = new AutoReloader();
    const startCommand = vscode.commands.registerCommand(startServerCommand, () =>
        autoReloader.start()
    );
    const stopCommand = vscode.commands.registerCommand(stopServerCommand, () =>
        autoReloader.stop()
    );
    context.subscriptions.concat(autoReloader, startCommand, stopCommand);

	function renameFiles() {
		let AutoRenameBpac = getConfiguration("auto-rename-bpac");
		let AutoRenameBpa = getConfiguration("auto-rename-bpa");
		let AutoRenameDialogue = getConfiguration("auto-rename-dialogue");
		let AutoRenameBpe = getConfiguration("auto-rename-bpe");
		let AutoRenameFunction = getConfiguration("auto-rename-function");
		let AutoRenameBpi = getConfiguration("auto-rename-bpi");
		let AutoRenameLoot = getConfiguration("auto-rename-loot");
		let AutoRenameRecipe = getConfiguration("auto-rename-recipe");
		let AutoRenameTrade = getConfiguration("auto-rename-trade");


		let AutoRenameRpac = getConfiguration("auto-rename-rpac");
		let AutoRenameRpa = getConfiguration("auto-rename-rpa");
		let AutoRenameAt = getConfiguration("auto-rename-at");
		let AutoRenameRpe = getConfiguration("auto-rename-rpe");
		let AutoRenameRpi = getConfiguration("auto-rename-rpi");
		let AutoRenameGeo = getConfiguration("auto-rename-geo");
		let AutoRenameParticle = getConfiguration("auto-rename-particle");

		if (AutoRenameBpac) { rename.filesInFolder(global.bpacFolderPath, '.json', '.bpac'); }
		if (AutoRenameBpa) { rename.filesInFolder(global.bpaFolderPath, '.json', '.bpa'); }
		if (AutoRenameDialogue) { rename.filesInFolder(global.bpDialogueFolderPath, '.json', '.dialogue'); }
		if (AutoRenameBpe) { rename.filesInFolder(global.bpeFolderPath, '.json', '.bpe'); } 
		if (AutoRenameFunction) { rename.filesInFolder(global.bpFunctionFolderPath, '.mcfunction', ''); }
		if (AutoRenameBpi) { rename.filesInFolder(global.bpiFolderPath, '.json', '.bpi'); }
		if (AutoRenameLoot) { rename.filesInFolder(global.bpLootTableFolderPath, '.json', '.loot'); }
		if (AutoRenameRecipe) { rename.filesInFolder(global.bpRecipeFolderPath, '.json', '.r'); }
		if (AutoRenameTrade) { rename.filesInFolder(global.bpTradingFolderPath, '.json', '.trade'); }
		
		if (AutoRenameRpac) { rename.filesInFolder(global.rpacFolderPath, '.json', '.rpac'); }
		if (AutoRenameRpa) { rename.filesInFolder(global.rpaFolderPath, '.json', '.rpa'); }
		if (AutoRenameAt) { rename.filesInFolder(global.rpAttachableFolderPath, '.json', '.at'); }
		if (AutoRenameRpe) { rename.filesInFolder(global.rpeFolderPath, '.json', '.rpe'); }
		if (AutoRenameRpi) { rename.filesInFolder(global.rpiFolderPath, '.json', '.rpi'); }
		if (AutoRenameGeo) { rename.filesInFolder(global.rpModelFolderPath, '.json', '.geo'); }
		if (AutoRenameParticle) { rename.filesInFolder(global.rpParticleFolderPath, '.json', '.particle'); }
	}
	context.subscriptions.push( bpManifest, rpManifest, bpRpManifest, onDidSaveTextDocument, onDidChangeWorkspaceFolders, onDidCreateFiles, onDidRenameFiles, scriptAPIManifest);
}

function deactivate() {}