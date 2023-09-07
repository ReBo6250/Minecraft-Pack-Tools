const vscode = require('vscode');
const path = require('path');
const {jsonReader, jsonConverter, getConfiguration, getFolders, getFilesInFolder, createDirectories} = require('./utils');
const manifestContent = require('./manifestContent');
const fs = require('fs');


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
                catch (error) { vscode.window.showErrorMessage('Error:', error); }
    
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
              .catch((error) => { vscode.window.showErrorMessage('Error:', error); });
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
      this.rpRenderPath = path.join(folder, 'render_controllers');
      this.rpManifestPath = path.join(folder, 'manifest.json');
      this.rpParticleFolderPath = path.join(folder, 'particles');
      this.rpSoundFolderPath = path.join(folder, 'sounds');
      this.rpUiFolderPath = path.join(folder, 'ui');
  }
  
	renameFiles() {
		let autoRenameFunctionAllowed = getConfiguration("auto-rename-function"); if (autoRenameFunctionAllowed) { this.#addExtensionToFunctionFiles(this.bpFunctionFolderPath, '.mcfunction'); }

		let autoRenameBpacAllowed = getConfiguration("auto-rename-bpac"); if (autoRenameBpacAllowed) { this.#addSuffixToFiles(this.bpacFolderPath, '.bpac', '.json'); };
    let autoRenameBpaAllowed = getConfiguration("auto-rename-bpa"); if (autoRenameBpaAllowed) { this.#addSuffixToFiles(this.bpaFolderPath, '.bpa', '.json'); };
		let autoRenameDialogueAllowed = getConfiguration("auto-rename-dialogue"); if (autoRenameDialogueAllowed) { this.#addSuffixToFiles(this.bpDialogueFolderPath, '.dialogue', '.json'); };
		let autoRenameBpeAllowed = getConfiguration("auto-rename-bpe"); if (autoRenameBpeAllowed) { this.#addSuffixToFiles(this.bpeFolderPath, '.bpe', '.json'); }; 
		let autoRenameBpiAllowed = getConfiguration("auto-rename-bpi"); if (autoRenameBpiAllowed) { this.#addSuffixToFiles(this.bpiFolderPath, '.bpi', '.json'); };
		let autoRenameLootAllowed = getConfiguration("auto-rename-loot"); if (autoRenameLootAllowed) { this.#addSuffixToFiles(this.bpLootTableFolderPath, '.loot', '.json'); };
		let autoRenameRecipeAllowed = getConfiguration("auto-rename-recipe"); if (autoRenameRecipeAllowed) { this.#addSuffixToFiles(this.bpRecipeFolderPath, '.r', '.json'); };
		let autoRenameTradeAllowed = getConfiguration("auto-rename-trade"); if (autoRenameTradeAllowed) { this.#addSuffixToFiles(this.bpTradingFolderPath, '.trade', '.json'); };

    let autoRenameRpacAllowed = getConfiguration("auto-rename-rpac"); if (autoRenameRpacAllowed) { this.#addSuffixToFiles(this.rpacFolderPath, '.rpac', '.json'); };
		let autoRenameRpaAllowed = getConfiguration("auto-rename-rpa"); if (autoRenameRpaAllowed) { this.#addSuffixToFiles(this.rpaFolderPath, '.rpa', '.json'); };
		let autoRenameAtAllowed = getConfiguration("auto-rename-at"); if (autoRenameAtAllowed) { this.#addSuffixToFiles(this.rpAttachableFolderPath, '.at', '.json'); };
		let autoRenameRpeAllowed = getConfiguration("auto-rename-rpe"); if (autoRenameRpeAllowed) { this.#addSuffixToFiles(this.rpeFolderPath, '.rpe', '.json'); };
		let autoRenameRenderAllowed = getConfiguration("auto-rename-render"); if (autoRenameRenderAllowed) { this.#addSuffixToFiles(this.rpRenderPath, '.render', '.json'); };
		let autoRenameRpiAllowed = getConfiguration("auto-rename-rpi"); if (autoRenameRpiAllowed) { this.#addSuffixToFiles(this.rpiFolderPath, '.rpi', '.json'); };
		let autoRenameGeoAllowed = getConfiguration("auto-rename-geo"); if (autoRenameGeoAllowed) { this.#addSuffixToFiles(this.rpModelFolderPath, '.geo', '.json'); };
		let autoRenameParticleAllowed = getConfiguration("auto-rename-particle"); if (autoRenameParticleAllowed) { this.#addSuffixToFiles(this.rpParticleFolderPath, '.particle', '.json'); };
	}

  #addSuffixToFiles(folderPath, suffix, targetExtension) {
    if (!fs.existsSync(folderPath)) {
      return;
    }
  
    const files = fs.readdirSync(folderPath);
  
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileExtension = path.extname(file);
      const baseName = path.basename(file, fileExtension);
  
      // Check if the file is not just an extension (e.g., '.gitignore')
      if (fileExtension !== '' && fileExtension !== targetExtension) {
        return; // Skip this file, as it has just an extension
      }
  
      if (fs.statSync(filePath).isFile() && (fileExtension === targetExtension || (fileExtension === '' && !baseName.startsWith('.')))) {
        const suffixRegex = /\.[^.]+$/i;
  
        if (!baseName.includes(' copy')) {
          const newFileName = baseName.replace(suffixRegex, '') + suffix + targetExtension;
  
          // Check if the file already contains the suffix
          if (file === newFileName) {
            return; // Skip renaming, as the suffix is already present
          }
  
          const newPath = path.join(folderPath, newFileName);
          try {
            fs.renameSync(filePath, newPath);
          } catch (error) {
            return;
          }
        }
      } else if (fs.statSync(filePath).isDirectory()) {
        this.#addSuffixToFiles(filePath, suffix, targetExtension); // Recursive call for subfolders
      }
    });
  
    // Refresh the workspace to reflect the changes
    // Note: If this function is not running in the context of Visual Studio Code extension, you may skip this line.
    vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
  }
  

  #addExtensionToFunctionFiles(folderPath, extension) {
    if (!fs.existsSync(folderPath)) { return; }
  
    const files = fs.readdirSync(folderPath);
  
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileExtension = path.extname(file);
  
      if (fs.statSync(filePath).isFile() && fileExtension === '') {
        const newFileName = file + extension;
        const newPath = path.join(folderPath, newFileName);
  
        if (fs.existsSync(filePath) && !fs.existsSync(newPath)) {
          try {
            fs.renameSync(filePath, newPath);
          } catch (error) {
            return;
          }
        }
      } else if (fs.statSync(filePath).isDirectory()) {
        this.#addExtensionToFunctionFiles(filePath, extension); // Recursive call for subfolders
      }
    });
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
      try { fs.writeFileSync(this.bpManifestPath, jsonConverter(manifestContent.BpWithDependencies)); } 
      catch (error) { console.log(error); }
      try { fs.writeFileSync(this.rpManifestPath, jsonConverter(manifestContent.RpWithDependencies)); } 
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
  createMcfunctionFromHighlightedText() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const highlightedText = editor.document.getText(selection);

      if (highlightedText) {
        const fileName = highlightedText + '.mcfunction';

          const filePath = path.join(this.bpFunctionFolderPath, fileName);
          if (fs.existsSync(filePath)) {
            vscode.window.showErrorMessage('Mcfunction already exist.');
            return;
          }

          const fileContent = 'testfor @s';

          createDirectories(path.dirname(filePath))
            .then(() => {
              fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                  vscode.window.showErrorMessage('Failed to create file: ' + err.message);
                } else {
                  vscode.window.showInformationMessage('File created successfully!');
                }
              });
            })
            .catch((err) => {
              vscode.window.showErrorMessage('Failed to create directories: ' + err.message);
            });
      } 
      else {
        vscode.window.showErrorMessage('No text is currently highlighted.');
      }
    } 
    else {
      vscode.window.showErrorMessage('No active text editor found.');
    }
  }
  

 async listFilesInDirectory() {
   const filePaths = await getFilesInFolder(this.rpSoundFolderPath);

   let outputFile = `${this.rpSoundFolderPath}\\sounds_list.txt`;

   fs.writeFile(outputFile, filePaths.join("\n"), (err) => {
     if (err) {
       console.error(`Error writing to file: ${err}`);
     } else {
       console.log(`File paths saved to ${outputFile}`);
     }
   });
 }

}

module.exports = {
	PackWorkspace
}


