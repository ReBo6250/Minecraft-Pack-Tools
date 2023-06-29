const vscode = require('vscode');
const path = require('path');
const {jsonReader, jsonConverter, getFilesInFolder, getConfiguration, getFolders} = require('./utils');
const manifestContent = require('./manifestContent');
var fs = require('fs');

class PackWorkspace {
  constructor() {
      this.#resetPackVariables()
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

  #findManifests(dir) {
    const files = fs.readdirSync(dir);
    let manifestPaths = [];
  
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        const nestedManifestPaths = this.#findManifests(filePath);
        manifestPaths = manifestPaths.concat(nestedManifestPaths);
      } else if (file === 'manifest.json') {
        manifestPaths.push(filePath);
      }
    }
  
    return manifestPaths;
  }
  #getTempBpFolder(workspaceFolders) {
    let tempFolders = [];
    for (const folder of workspaceFolders) {
      getFolders(folder.uri.fsPath).then((folderPaths) => {
        for (const folderPath of folderPaths) {
          if (
            folderPath.includes('bp0') ||
            folderPath.includes('Behavior') ||
            folderPath.includes('Behavior Pack') ||
            folderPath.includes('BP') ||
            folderPath.includes('_BP')
          ) 
          { tempFolders.push(folderPath) }
        }
        
        if (tempFolders[tempFolders.length - 1] !== undefined) {
          this.#getBpPackInfo(tempFolders[tempFolders.length - 1]); 
          // vscode.window.showInformationMessage(`No Behavior Pack Manifest found. Selecting ${tempFolders[tempFolders.length - 1]} as a default BP folder.`);
        } 
      });
    }
  }
  
  #getTempRpFolder(workspaceFolders) {
      let tempFolders = [];
      for (const folder of workspaceFolders) {
      getFolders(folder.uri.fsPath).then((folderPaths) => {
        for (const folderPath of folderPaths) {
          if (
            folderPath.includes('rp0') ||
            folderPath.includes('Resource') ||
            folderPath.includes('Resource Pack') ||
            folderPath.includes('RP') ||
            folderPath.includes('_RP')
          ) 
          { tempFolders.push(folderPath) }
        }
        if (tempFolders[tempFolders.length - 1] !== undefined) {
          this.#getRpPackInfo(tempFolders[tempFolders.length - 1]);
          // vscode.window.showInformationMessage(`No Resource Pack Manifest found. Selecting ${tempFolders[tempFolders.length - 1]} as a default RP folder.`);
        } 
      });
    }
  }
  getPackWorkspaceInfo(workspaceFolders) {
    // this.#resetPackVariables();
    if (workspaceFolders) {
      for (const workspaceFolder of workspaceFolders) {
        const workspacePath = workspaceFolder.uri.fsPath;
        const manifestPaths = this.#findManifests(workspacePath);
  
        if (manifestPaths.length > 0) {
          manifestPaths.forEach((manifestPath, index) => {
            jsonReader(manifestPath)
              .then((manifest) => {
                let modules = JSON.stringify(manifest.modules);
                modules = modules.slice(1, -1);
    
                let module;
                try { module = JSON.parse(modules); } 
                catch (error) { vscode.showErrorMessage('Error:', error); }
    
                const packFolderPath = manifestPath.replace('manifest.json', '');
                if (module.type.toString() === 'data') {
                  this.bpManifestCount++;
                  this.hasBpManifest = true;
                  this.#getBpPackInfo(packFolderPath);
                } 
                else if (module.type.toString() === 'resources') {
                  this.rpManifestCount++;
                  this.hasRpManifest = true;
                  this.#getRpPackInfo(packFolderPath);
                } 
                else if (module.type.toString() === 'world_template') {
                  // Handle 'world_template' case
                }
                if (index === manifestPaths.length - 1) {
                  if (!this.hasBpManifest) { this.#getTempBpFolder(workspaceFolders);}
                  if (!this.hasRpManifest) { this.#getTempRpFolder(workspaceFolders);}
                }

              })
              .catch((error) => { vscode.showErrorMessage('Error:', error); });
          });
        }
        else {
          this.#getTempBpFolder(workspaceFolders)
          this.#getTempRpFolder(workspaceFolders)
        }
      }
    }
  };
  
  

  
  async #getBpPackInfo(folder) {
      this.bpacFolderPath = path.join(folder, 'animation_controllers');
      this.bpaFolderPath = path.join(folder, 'animations');
      this.bpDialogueFolderPath = path.join(folder, 'dialogue');
      this.bpeFolderPath = path.join(folder, 'entities');
      this.bpFolderPath = folder
      this.bpFunctionFolderPath = path.join(folder, 'functions');
      this.bpiFolderPath = path.join(folder, 'items');
      this.bpLootTableFolderPath = path.join(folder, 'loot_tables');
      this.bpManifestPath = path.join(folder, 'manifest.json');
      this.bpRecipeFolderPath = path.join(folder, 'recipes');
      this.bpSpawnRulePath = path.join(folder, 'spawn_rules');
      this.bpTradingFolderPath = path.join(folder, 'trading');
      this.hasBpFolder = true;
  }

  async #getRpPackInfo(folder) {
      this.hasRpFolder = true;
      this.rpacFolderPath = path.join(folder, 'animation_controllers');
      this.rpaFolderPath = path.join(folder, 'animations');
      this.rpAttachableFolderPath = path.join(folder, 'attachables');
      this.rpeFolderPath = path.join(folder, 'entity');
      this.rpModelFolderPath = path.join(folder, 'models');
      this.rpFolderPath = folder;
      this.rpiFolderPath = path.join(folder, 'items');
      this.rpManifestPath = path.join(folder, 'manifest.json');
      this.rpParticleFolderPath = path.join(folder, 'particles');
  }
  
	renameFiles() {
		let autoRenameBpacAllowed = getConfiguration("auto-rename-bpac"); if (autoRenameBpacAllowed) { this.#renameFilesInFolder(this.bpacFolderPath, '.json', '.bpac'); };
    let autoRenameBpaAllowed = getConfiguration("auto-rename-bpa"); if (autoRenameBpaAllowed) { this.#renameFilesInFolder(this.bpaFolderPath, '.json', '.bpa'); };
		let autoRenameDialogueAllowed = getConfiguration("auto-rename-dialogue"); if (autoRenameDialogueAllowed) { this.#renameFilesInFolder(this.bpDialogueFolderPath, '.json', '.dialogue'); }
		let autoRenameBpeAllowed = getConfiguration("auto-rename-bpe"); if (autoRenameBpeAllowed) { this.#renameFilesInFolder(this.bpeFolderPath, '.json', '.bpe'); }; 
		let autoRenameFunctionAllowed = getConfiguration("auto-rename-function"); if (autoRenameFunctionAllowed) { this.#renameFilesInFolder(this.bpFunctionFolderPath, '.mcfunction', ''); }
		let autoRenameBpiAllowed = getConfiguration("auto-rename-bpi"); if (autoRenameBpiAllowed) { this.#renameFilesInFolder(this.bpiFolderPath, '.json', '.bpi'); };
		let autoRenameLootAllowed = getConfiguration("auto-rename-loot"); if (autoRenameLootAllowed) { this.#renameFilesInFolder(this.bpLootTableFolderPath, '.json', '.loot'); }
		let autoRenameRecipeAllowed = getConfiguration("auto-rename-recipe"); if (autoRenameRecipeAllowed) { this.#renameFilesInFolder(this.bpRecipeFolderPath, '.json', '.r'); }
		let autoRenameTradeAllowed = getConfiguration("auto-rename-trade"); if (autoRenameTradeAllowed) { this.#renameFilesInFolder(this.bpTradingFolderPath, '.json', '.trade'); }

    let autoRenameRpacAllowed = getConfiguration("auto-rename-rpac"); if (autoRenameRpacAllowed) { this.#renameFilesInFolder(this.rpacFolderPath, '.json', '.rpac'); }
		let autoRenameRpaAllowed = getConfiguration("auto-rename-rpa"); if (autoRenameRpaAllowed) { this.#renameFilesInFolder(this.rpaFolderPath, '.json', '.rpa'); }
		let autoRenameAtAllowed = getConfiguration("auto-rename-at"); if (autoRenameAtAllowed) { this.#renameFilesInFolder(this.rpAttachableFolderPath, '.json', '.at'); }
		let autoRenameRpeAllowed = getConfiguration("auto-rename-rpe"); if (autoRenameRpeAllowed) { this.#renameFilesInFolder(this.rpeFolderPath, '.json', '.rpe'); }
		let autoRenameRpiAllowed = getConfiguration("auto-rename-rpi"); if (autoRenameRpiAllowed) { this.#renameFilesInFolder(this.rpiFolderPath, '.json', '.rpi'); }
		let autoRenameGeoAllowed = getConfiguration("auto-rename-geo"); if (autoRenameGeoAllowed) { this.#renameFilesInFolder(this.rpModelFolderPath, '.json', '.geo'); }
		let autoRenameParticleAllowed = getConfiguration("auto-rename-particle"); if (autoRenameParticleAllowed) { this.#renameFilesInFolder(this.rpParticleFolderPath, '.json', '.particle'); }
	}
  
  #renameFilesInFolder(parentFolderPath, targetExtension, subExtension) {
      if(!fs.existsSync(parentFolderPath)) {return;}
      else {
        getFilesInFolder(parentFolderPath).then((filePaths) => { 
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

    
  createBpManifest() {
    if (!this.hasBpManifest) {
      try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.Bp)); } 
      catch (error) { console.log(error); }
    } 
    else { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
  }

  createRpManifest() {
    if (!this.hasRpManifest) {
      try { fs.writeFileSync(this.rpManifestPath, jsonConverter(manifestContent.Rp)); } 
      catch (error) { console.log(error); }
    } 
    else { vscode.window.showErrorMessage(`File: ${this.rpManifestPath} already exists.`); }
    
  }
  createBpRpManifest() {
    if (!this.hasBpManifest && !this.hasRpManifest) {
      try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.Bp)); } 
      catch (error) { console.log(error); }
      try { fs.writeFileSync(this.rpManifestPath, jsonConverter(manifestContent.Rp)); } 
      catch (error) { console.log(error); }
    } 
    else {
      if (this.hasBpManifest) { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
      if (this.hasRpManifest) { vscode.window.showErrorMessage(`File: ${this.rpManifestPath} already exists.`); }
    }
  }
  createScriptAPIManifest() {
    if (!this.hasBpManifest) {
      try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.ScriptAPI)); } 
      catch (error) { console.log(error); }
    } 
    else { vscode.window.showErrorMessage(`File: ${this.bpManifestPath} already exists.`); }
  }
}

module.exports = {
	PackWorkspace
}


