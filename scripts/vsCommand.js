const vscode = require('vscode');
const fs = require('fs');
const packFolders = require('./packFolders');
const manifestContent = require('./manifestContent');


module.exports = {
	createBpManifest,
	createRpManifest,
	createBpRpManifest,
	createScriptAPIManifest
}

const jsonConverter = (obj, indent = 2) => 
	JSON.stringify(obj, (key, value) => {
		if (Array.isArray(value) && !value.some(x => x && typeof x === 'object')) {
			return `\uE000${JSON.stringify(value.map(v => typeof v === 'string' ? v.replace(/"/g, '\uE001') : v))}\uE000`;
		}
		return value;
	}, 
	indent).replace(/"\uE000([^\uE000]+)\uE000"/g, match => match.substr(2, match.length - 4).replace(/\\"/g, '"').replace(/\uE001/g, '\\\"'));

function createBpManifest() {
	packFolders.checkManifests();
	setTimeout(() => {
		if (!global.hasBpManifest) {
			try { fs.writeFileSync(global.bpManifestPath, jsonConverter(manifestContent.Bp)); } 
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
				fs.writeFileSync(global.rpManifestPath, jsonConverter(manifestContent.Rp));
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
			fs.writeFileSync(global.bpManifestPath, jsonConverter(manifestContent.BpWithDependencies));
			fs.writeFileSync(global.rpManifestPath, jsonConverter(manifestContent.RpWithDependencies));
		} 
		else {
			if (global.hasBpManifest) { vscode.window.showErrorMessage(`File: ${global.bpManifestPath} already exists.`); }
			if (global.hasRpManifest) { vscode.window.showErrorMessage(`File: ${global.rpManifestPath} already exists.`); }
		}
	}, 100);
}
function createScriptAPIManifest() {
	packFolders.checkManifests();
	setTimeout(() => {
		if (!global.hasBpManifest) {
			try { fs.writeFileSync(global.bpManifestPath, jsonConverter(manifestContent.ScriptAPI)); } 
			catch (error) { console.log(error); }
		} 
		else { vscode.window.showErrorMessage(`File: ${global.bpManifestPath} already exists.`); }
	}, 100);
}
