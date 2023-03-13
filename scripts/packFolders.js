const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const workspaceFolders = vscode.workspace.workspaceFolders;

global.extensionVersion = "2.5.3"
global.minEngineVersion = [1, 19, 50]


module.exports = {
	checkManifests,
    checkPackFolders
}

function resetGlobalVariablesHere() {
    global.bpManifestCount = 0;
    global.bpFolderPath = null;
    global.bpManifestPath = null;
    global.hasBpFolder = false;
    global.hasBpManifest = false;

    global.rpManifestCount = 0;
    global.rpFolderPath= null;
    global.rpManifestPath= null;
    global.hasRpFolder = false;
    global.hasRpManifest = false;
}
function checkPackFolders(){
    checkManifests();
};
function checkManifests() {
    resetGlobalVariablesHere();
    workspaceFolders.forEach(folder => {
        let manifestPath = path.join(folder.uri.fsPath, 'manifest.json')
        if (fs.existsSync(manifestPath)) { 
            jsonReader(manifestPath, (err, manifest) => {
                if (err) {
                    vscode.showErrorMessage('Invalid Manifest Detected.')
                    return;
                }

                let modules = JSON.stringify(manifest.modules);
                modules = modules.slice(1,-1);

                let module;
                try { module = JSON.parse(modules); } 
                catch (error) {
                    vscode.showErrorMessage('Invalid Manifest module Detected.');
                    return;
                }
                
                if (module.type.toString() == 'data') {
                    global.bpManifestCount++;
                    global.hasBpManifest = true;

                    getBpPackInfo(folder);
                }
                if (module.type.toString() == 'resources') {
                    global.rpManifestCount++;
                    global.hasRpManifest = true;

                    getRpPackInfo(folder);
                }
            });
        }

        if (!global.hasBpFolder || !global.hasRpFolder) {
            if (path.format(folder).includes('Behavior') || 
                path.format(folder).includes('Behavior Pack') || 
                path.format(folder).includes('BP') || 
                path.format(folder).includes('_BP')) {
                
                getBpPackInfo(folder);
            }
            if (path.format(folder).includes('Resource') || 
                path.format(folder).includes('Resource Pack') ||
                path.format(folder).includes('RP') || 
                path.format(folder).includes('_RP')) {
               
                getRpPackInfo(folder);
            }
        }
    });
}
function getBpPackInfo(folder) {
    global.bpacFolderPath = path.join(folder.uri.fsPath, 'animation_controllers');
    global.bpaFolderPath = path.join(folder.uri.fsPath, 'animations');
    global.bpDialogueFolderPath = path.join(folder.uri.fsPath, 'dialogue');
    global.bpeFolderPath = path.join(folder.uri.fsPath, 'entities');
    global.bpFolderPath = folder.uri.fsPath
    global.bpFunctionFolderPath = path.join(folder.uri.fsPath, 'functions');
    global.bpiFolderPath = path.join(folder.uri.fsPath, 'items');
    global.bpLootTableFolderPath = path.join(folder.uri.fsPath, 'loot');
    global.bpManifestPath = path.join(folder.uri.fsPath, 'manifest.json');
    global.bpRecipeFolderPath = path.join(folder.uri.fsPath, 'recipes');
    global.bpSpawnRulePath = path.join(folder.uri.fsPath, 'spawn_rules');
    global.bpTradingFolderPath = path.join(folder.uri.fsPath, 'trading');
    global.hasBpFolder = true;
}

function getRpPackInfo(folder) {
    global.hasRpFolder = true;
    global.rpacFolderPath = path.join(folder.uri.fsPath, 'animation_controllers');
    global.rpaFolderPath = path.join(folder.uri.fsPath, 'animations');
    global.rpAttachableFolderPath = path.join(folder.uri.fsPath, 'attachables');
    global.rpeFolderPath = path.join(folder.uri.fsPath, 'entity');
    global.rpFolderPath = folder.uri.fsPath;
    global.rpiFolderPath = path.join(folder.uri.fsPath, 'items');
    global.rpManifestPath = path.join(folder.uri.fsPath, 'manifest.json');
    global.rpModelFolderPath = path.join(folder.uri.fsPath, 'model');
    global.rpParticleFolderPath = path.join(folder.uri.fsPath, 'particles');
}

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) { return cb && cb(err); }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
};
