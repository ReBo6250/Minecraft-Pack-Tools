const vscode = require('vscode');
const vsCommand = require('./vsCommand');
const rename = require('./rename');
const workspace = require('./workspace');
const utils = require('./utils');

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


	function renameFiles() {
		let AutoRenameBpac = utils.getConfiguration("auto-rename-bpac");
		let AutoRenameBpa = utils.getConfiguration("auto-rename-bpa");
		let AutoRenameDialogue = utils.getConfiguration("auto-rename-dialogue");
		let AutoRenameBpe = utils.getConfiguration("auto-rename-bpe");
		let AutoRenameFunction = utils.getConfiguration("auto-rename-function");
		let AutoRenameBpi = utils.getConfiguration("auto-rename-bpi");
		let AutoRenameLoot = utils.getConfiguration("auto-rename-loot");
		let AutoRenameRecipe = utils.getConfiguration("auto-rename-recipe");
		let AutoRenameTrade = utils.getConfiguration("auto-rename-trade");


		let AutoRenameRpac = utils.getConfiguration("auto-rename-rpac");
		let AutoRenameRpa = utils.getConfiguration("auto-rename-rpa");
		let AutoRenameAt = utils.getConfiguration("auto-rename-at");
		let AutoRenameRpe = utils.getConfiguration("auto-rename-rpe");
		let AutoRenameRpi = utils.getConfiguration("auto-rename-rpi");
		let AutoRenameGeo = utils.getConfiguration("auto-rename-geo");
		let AutoRenameParticle = utils.getConfiguration("auto-rename-particle");

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