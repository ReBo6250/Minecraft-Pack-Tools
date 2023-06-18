const vscode = require('vscode');
const path = require('path');
const {jsonReader, jsonConverter, getFilesInFolder, getConfiguration, getFilePaths} = require('./utils');
const manifestContent = require('./manifestContent');
var fs = require('fs');

class PackWorkspace {
  constructor() {
  }
  
  #resetPackVariables() {
    this.bpManifestCount = 0;
    this.bpFolderPath = null;
    this.bpManifestPath = null;
    this.hasBpManifest = false;
    this.rpManifestCount = 0;
    this.rpFolderPath= null;
    this.rpManifestPath= null;
    this.hasRpManifest = false;
  }
  
  async getPackWorkspaceInfo(workspaceFolders) {
    workspaceFolders.forEach(
        folder => {
          this.#resetPackVariables();
          getFilesInFolder(folder.uri.fsPath).then(
            console.log(filePaths);
            filePaths => {
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
                            this.bpFolderPath = packFolderPath;
                            console.log(this.bpFolderPath);
                            this.bpManifestCount++;
                            this.hasBpManifest = true;
                            this.#getBpPackInfo(packFolderPath);
                        }
                        else if (module.type.toString() === 'resources') {
                            this.rpFolderPath = packFolderPath;
                            this.rpManifestCount++;
                            this.hasRpManifest = true;
                            this.#getRpPackInfo(packFolderPath);
                        }
                        else if (module.type.toString() === 'world_template') {}
                      }
                    );
                  }
                }
              )
            }
          );
        }
    );
    if (!this.hasRpManifest || !this.hasRpManifest) {
      workspaceFolders.forEach(
        folder => {
          if (path.format(folder).includes('bp0') || path.format(folder).includes('Behavior') || path.format(folder).includes('Behavior Pack') || path.format(folder).includes('BP') || path.format(folder).includes('_BP')) {
            this.#getBpPackInfo(folder); }
          else if (path.format(folder).includes('rp0') || path.format(folder).includes('Resource') || path.format(folder).includes('Resource Pack') || path.format(folder).includes('RP') || path.format(folder).includes('_RP')) { 
            this.#getRpPackInfo(folder); }
        }
      );
    }
  };

  
  #getBpPackInfo(bpPackFolderPath) {
    this.bpacFolderPath = path.join(bpPackFolderPath, 'animation_controllers');
    this.bpaFolderPath = path.join(bpPackFolderPath, 'animations');
    this.bpDialogueFolderPath = path.join(bpPackFolderPath, 'dialogue');
    this.bpeFolderPath = path.join(bpPackFolderPath, 'entities');
    this.bpFolderPath = bpPackFolderPath
    this.bpFunctionFolderPath = path.join(bpPackFolderPath, 'functions');
    this.bpiFolderPath = path.join(bpPackFolderPath, 'items');
    this.bpLootTableFolderPath = path.join(bpPackFolderPath, 'loot_tables');
    this.bpManifestPath = path.join(bpPackFolderPath, 'manifest.json');
    this.bpRecipeFolderPath = path.join(bpPackFolderPath, 'recipes');
    this.bpSpawnRulePath = path.join(bpPackFolderPath, 'spawn_rules');
    this.bpTradingFolderPath = path.join(bpPackFolderPath, 'trading');
    this.hasBpFolder = true;
  }

  #getRpPackInfo(rpPackFolderPath) {
    this.hasRpFolder = true;
    this.rpacFolderPath = path.join(rpPackFolderPath, 'animation_controllers');
    this.rpaFolderPath = path.join(rpPackFolderPath, 'animations');
    this.rpAttachableFolderPath = path.join(rpPackFolderPath, 'attachables');
    this.rpeFolderPath = path.join(rpPackFolderPath, 'entity');
    this.rpModelFolderPath = path.join(rpPackFolderPath, 'models');
    this.rpFolderPath = rpPackFolderPath;
    this.rpiFolderPath = path.join(rpPackFolderPath, 'items');
    this.rpManifestPath = path.join(rpPackFolderPath, 'manifest.json');
    this.rpParticleFolderPath = path.join(rpPackFolderPath, 'particles');
  }
  
	renameFiles() {
		const autoRenameBpacAllowed = getConfiguration("auto-rename-bpac"); if (autoRenameBpacAllowed) { this.#renameFilesInFolder(this.bpacFolderPath, '.json', '.bpac'); };
		const autoRenameBpaAllowed = getConfiguration("auto-rename-bpa"); if (autoRenameBpaAllowed) { this.#renameFilesInFolder(this.bpaFolderPath, '.json', '.bpa'); };
		const autoRenameDialogueAllowed = getConfiguration("auto-rename-dialogue"); if (autoRenameDialogueAllowed) { this.#renameFilesInFolder(this.bpDialogueFolderPath, '.json', '.dialogue'); }
		const autoRenameBpeAllowed = getConfiguration("auto-rename-bpe"); if (autoRenameBpeAllowed) { this.#renameFilesInFolder(this.bpeFolderPath, '.json', '.bpe'); }; 
		const autoRenameFunctionAllowed = getConfiguration("auto-rename-function"); if (autoRenameFunctionAllowed) { this.#renameFilesInFolder(this.bpFunctionFolderPath, '.mcfunction', ''); }
		const autoRenameBpiAllowed = getConfiguration("auto-rename-bpi"); if (autoRenameBpiAllowed) { this.#renameFilesInFolder(this.bpiFolderPath, '.json', '.bpi'); };
		const autoRenameLootAllowed = getConfiguration("auto-rename-loot"); if (autoRenameLootAllowed) { this.#renameFilesInFolder(this.bpLootTableFolderPath, '.json', '.loot'); }
		const autoRenameRecipeAllowed = getConfiguration("auto-rename-recipe"); if (autoRenameRecipeAllowed) { this.#renameFilesInFolder(this.bpRecipeFolderPath, '.json', '.r'); }
		const autoRenameTradeAllowed = getConfiguration("auto-rename-trade"); if (autoRenameTradeAllowed) { this.#renameFilesInFolder(this.bpTradingFolderPath, '.json', '.trade'); }


		const autoRenameRpacAllowed = getConfiguration("auto-rename-rpac"); if (autoRenameRpacAllowed) { this.#renameFilesInFolder(this.rpacFolderPath, '.json', '.rpac'); }
		const autoRenameRpaAllowed = getConfiguration("auto-rename-rpa"); if (autoRenameRpaAllowed) { this.#renameFilesInFolder(this.rpaFolderPath, '.json', '.rpa'); }
		const autoRenameAtAllowed = getConfiguration("auto-rename-at"); if (autoRenameAtAllowed) { this.#renameFilesInFolder(this.rpAttachableFolderPath, '.json', '.at'); }
		const autoRenameRpeAllowed = getConfiguration("auto-rename-rpe"); if (autoRenameRpeAllowed) { this.#renameFilesInFolder(this.rpeFolderPath, '.json', '.rpe'); }
		const autoRenameRpiAllowed = getConfiguration("auto-rename-rpi"); if (autoRenameRpiAllowed) { this.#renameFilesInFolder(this.rpiFolderPath, '.json', '.rpi'); }
		const autoRenameGeoAllowed = getConfiguration("auto-rename-geo"); if (autoRenameGeoAllowed) { this.#renameFilesInFolder(this.rpModelFolderPath, '.json', '.geo'); }
		const autoRenameParticleAllowed = getConfiguration("auto-rename-particle"); if (autoRenameParticleAllowed) { this.#renameFilesInFolder(this.rpParticleFolderPath, '.json', '.particle'); }
	}
  
  #renameFilesInFolder(parentFolderPath, targetExtension, subExtension) {
    if(!fs.existsSync(parentFolderPath)) {return;}
    else {
      getFilePaths(parentFolderPath).then((filePaths) => { 
        filePaths.forEach((filePath) => {
          let newFilePath;
    
          if (filePath.includes(`${subExtension} copy${targetExtension}`)) {
            newFilePath = filePath.replace(`${subExtension} copy${targetExtension}`, `${subExtension}${targetExtension}`)
            let index = 2;
    
            while (fs.existsSync(newFilePath)) {
              newFilePath =  filePath.replace(`${subExtension} copy${targetExtension}`, `${index}${subExtension}${targetExtension}`)
              index++;
              if (!fs.existsSync(newFilePath)) { 
                fs.rename(filePath, newFilePath, (error) => { if (error) console.log(error)});
                break; 
              }
            }
          }
          if (!filePath.includes(`.`) || (!filePath.includes(`${subExtension}${targetExtension}`) && !filePath.includes(`${subExtension} copy`))) {
            const SubExtensionList = ['.ac','.animation_controllers', '.animation_controller', '.animation', '.anim', '.at', '.behavior', '.bpac', '.bpa', '.bpe', '.bpi', '.dialogue', '.entity', '.geo', '.loot', '.particle', '.rpac', '.rpa', '.rpe', '.rpi', '.r', '.trade'] // Order is important here.
            for (let index = 0; index < SubExtensionList.length; index++) {
              const subExtensionListElement = SubExtensionList[index];
              if (filePath.includes(`${subExtensionListElement}`)) {
                newFilePath = filePath.replace(`${subExtensionListElement}${targetExtension}`, `${subExtension}${targetExtension}`);
                break;
              }
              else if(subExtensionListElement === SubExtensionList[SubExtensionList.length - 1]){
                if (!filePath.includes(`.`)) {
                  newFilePath = filePath.replace(`${filePath}`, `${filePath}${subExtension}${targetExtension}`);
                }
                else {
                  newFilePath = filePath.replace(`${targetExtension}`, `${subExtension}${targetExtension}`);
                }
              }
            }
            fs.rename(filePath, newFilePath, (error) => { if (error) console.log(error)});
          }
        })
      })
    }
  }

    
  async createBpManifest() {
    if (!this.hasBpManifest) {
      try { fs.writeFileSync(this.bpManifestPath, await jsonConverter(manifestContent.Bp)); } 
      catch (error) { console.log(error); }
    } 
    else { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
    // setTimeout(() => {
    // 	if (!this.hasBpManifest) {
    // 		try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.Bp)); } 
    // 		catch (error) { console.log(error); }
    // 	} 
    // 	else { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
    // }, 100);
  }

  createRpManifest() {

    setTimeout(() => {
      if (!this.hasRpManifest) {
        try {
          fs.writeFileSync(this.rpManifestPath, jsonConverter(manifestContent.Rp));
        } catch (error) {
          console.log(error);
        }
      } 
      else {
        vscode.window.showErrorMessage(`File: ${this.rpManifestPath} already exists.`);
      }
    }, 100);
    
  }
  createBpRpManifest() {

    setTimeout(() => {
      if (!this.hasBpManifest && !this.hasRpManifest) {
        fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.BpWithDependencies));
        fs.writeFileSync(this.rpManifestPath, jsonConverter(manifestContent.RpWithDependencies));
      } 
      else {
        if (this.hasBpManifest) { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
        if (this.hasRpManifest) { vscode.window.showErrorMessage(`File: ${this.rpManifestPath} already exists.`); }
      }
    }, 100);
  }
  createScriptAPIManifest() {
    setTimeout(() => {
      if (!this.hasBpManifest) {
        try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.ScriptAPI)); } 
        catch (error) { console.log(error); }
      } 
      else { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
    }, 100);
  }
}

module.exports = {
	PackWorkspace
}



