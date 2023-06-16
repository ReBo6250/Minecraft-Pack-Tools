const vscode = require('vscode');
const path = require('path');
const { readdir } = require('fs').promises;
const {jsonReader} = require('./utils')



module.exports = {
	getPackFolders
}

global.extensionVersion = "2.5.7"
global.minEngineVersion = [1, 19, 50]
global.extensionName = "minecraft-pack-tools"

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

async function getPackFolders() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  workspaceFolders.forEach(
      folder => {

        getFilesInFolder(folder.uri.fsPath).then(
          filePaths => {
            resetGlobalVariablesHere();
            filePaths.forEach(
              filePath => {

                if (filePath.includes(`manifest.json`)) {
                  jsonReader(filePath,
                    (err, manifest) => {
                      if (err) { vscode.showErrorMessage('Invalid Manifest Detected.') }
                      let modules = JSON.stringify(manifest.modules);
                      modules = modules.slice(1,-1);

                      let module;
                      try { module = JSON.parse(modules); } 
                      catch (error) { vscode.showErrorMessage('Invalid Manifest module Detected.'); }

                      const packFolderPath = filePath.replace(`/manifest.json`,``);
                      if (module.type.toString() === 'data') {
                          global.bpFolderPath = packFolderPath;
                          global.bpManifestCount++;
                          global.hasBpManifest = true;
                          getBpPackInfo(packFolderPath);
                      }
                      else if (module.type.toString() === 'resources') {
                          global.rpFolderPath = packFolderPath;
                          global.rpManifestCount++;
                          global.hasRpManifest = true;
                          getRpPackInfo(packFolderPath);
                      }
                      else if (module.type.toString() === 'world_template') {}
                    }
                  );
                }
              }
            )


            // if (!global.hasBpFolder || !global.hasRpFolder) {
            //   if (path.format(folder).includes('bp0') || 
            //       path.format(folder).includes('Behavior') || 
            //       path.format(folder).includes('Behavior Pack') || 
            //       path.format(folder).includes('BP') || 
            //       path.format(folder).includes('_BP')) {
                  
            //       getBpPackInfo(folder);
            //   }
            //   else if (path.format(folder).includes('rp0') || 
            //       path.format(folder).includes('Resource') || 
            //       path.format(folder).includes('Resource Pack') ||
            //       path.format(folder).includes('RP') || 
            //       path.format(folder).includes('_RP')) {
                 
            //       getRpPackInfo(folder);
            //   }
          // }
          }
        );
      }
    );
};

async function getBpPackInfo(bpPackFolderPath) {
  global.bpacFolderPath = path.join(bpPackFolderPath, 'animation_controllers');
  global.bpaFolderPath = path.join(bpPackFolderPath, 'animations');
  global.bpDialogueFolderPath = path.join(bpPackFolderPath, 'dialogue');
  global.bpeFolderPath = path.join(bpPackFolderPath, 'entities');
  global.bpFolderPath = bpPackFolderPath
  global.bpFunctionFolderPath = path.join(bpPackFolderPath, 'functions');
  global.bpiFolderPath = path.join(bpPackFolderPath, 'items');
  global.bpLootTableFolderPath = path.join(bpPackFolderPath, 'loot_tables');
  global.bpManifestPath = path.join(bpPackFolderPath, 'manifest.json');
  global.bpRecipeFolderPath = path.join(bpPackFolderPath, 'recipes');
  global.bpSpawnRulePath = path.join(bpPackFolderPath, 'spawn_rules');
  global.bpTradingFolderPath = path.join(bpPackFolderPath, 'trading');
  global.hasBpFolder = true;
}

async function getRpPackInfo(rpPackFolderPath) {
  global.hasRpFolder = true;
  global.rpacFolderPath = path.join(rpPackFolderPath, 'animation_controllers');
  global.rpaFolderPath = path.join(rpPackFolderPath, 'animations');
  global.rpAttachableFolderPath = path.join(rpPackFolderPath, 'attachables');
  global.rpeFolderPath = path.join(rpPackFolderPath, 'entity');
  global.rpModelFolderPath = path.join(rpPackFolderPath, 'models');
  global.rpFolderPath = rpPackFolderPath;
  global.rpiFolderPath = path.join(rpPackFolderPath, 'items');
  global.rpManifestPath = path.join(rpPackFolderPath, 'manifest.json');
  global.rpParticleFolderPath = path.join(rpPackFolderPath, 'particles');
}

async function getFilesInFolder(parentFolderPath) {
  let filePaths = [];
  const files = await readdir(parentFolderPath, { withFileTypes: true });

  for (const file of files) {
      if (file.isDirectory()) { filePaths = [ ...filePaths, ...(await getFilesInFolder(`${parentFolderPath}/${file.name}`)), ];} 
      else { filePaths.push(`${parentFolderPath}/${file.name}`); }
  }
  return filePaths;
};
