const vscode = require('vscode');
const fs = require('fs');
const packFolders = require('./packFolders');
const manifestContent = require('./manifestContent');


module.exports = {
	createBpManifest,
	createRpManifest,
	createBpRpManifest
}

function createBpManifest() {
	packFolders.checkManifests();
	setTimeout(() => {
		if (!global.hasBpManifest) {
			try { fs.writeFileSync(global.bpManifestPath, manifestContent.Bp); } 
			catch (error) { console.log(error); }
		} 
		else { vscode.window.showErrorMessage(`File: ${global.bpManifestPath} already exists.`); }
	}, 100);
}

function createRpManifest() {
	packFolders.checkManifests();

	setTimeout(() => {
		if (!global.hasRpManifest) {
			try {
				fs.writeFileSync(global.rpManifestPath, manifestContent.Rp);
			} catch (error) {
				console.log(error);
			}
		} 
		else {
			vscode.window.showErrorMessage(`File: ${global.rpManifestPath} already exists.`);
		}
	}, 100);
	
}
function createBpRpManifest() {
	packFolders.checkManifests();

	setTimeout(() => {
		if (!global.hasBpManifest && !global.hasRpManifest) {
			fs.writeFileSync(global.bpManifestPath, manifestContent.BpWithDependencies);
			fs.writeFileSync(global.rpManifestPath, manifestContent.RpWithDependencies);
		} 
		else {
			if (global.hasBpManifest) { vscode.window.showErrorMessage(`File: ${global.bpManifestPath} already exists.`); }
			if (global.hasRpManifest) { vscode.window.showErrorMessage(`File: ${global.rpManifestPath} already exists.`); }
		}
	}, 100);
}
