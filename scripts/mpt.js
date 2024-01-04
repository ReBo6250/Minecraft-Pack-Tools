const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

module.exports = class MptWorkspace {
  constructor() {
    this.#initialize();
  }

  bpFolderPaths = [];
  rpFolderPaths = [];
  selectedBpFolder;
  selectedRpFolder;
  #hasBpManifest = false;
  #hasRpManifest = false;

  #bpAnimationControllerPath;
  #bpAnimationPath;
  #bpDialoguePath;
  #bpEntityPath;
  #bpFunctionPath;
  #bpItemPath;
  #bpLootPath;
  #bpRecipePath;
  #bpSciptsPath;
  #bpSpawnRulePath;
  #bpTradingFolderPath;

  #rpAnimationControllerPath;
  #rpAnimationPath;
  #rpAttachablePath;
  #rpEntityPath;
  #rpModelPath;
  #rpItemPath;
  #rpRenderPath;
  #rpParticlePath;
  #rpSoundPath;
  #rpUiPath;

  #initialize() {
    if (vscode.workspace.workspaceFolders) {
      vscode.workspace.workspaceFolders.forEach((folder) => {
        const folderPath = folder.uri.fsPath;
        this.#getAllManifestPaths(folderPath);
      });
      if (this.bpFolderPaths.length > 0 || this.rpFolderPaths.length > 0) {
        this.#startWatchFiles();
      }
    }
  }

  #getAllManifestPaths(rootPath) {
    const traverseDirectory = (currentPath) => {
      const files = fs.readdirSync(currentPath);

      files.forEach((file) => {
        const filePath = path.join(currentPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          traverseDirectory(filePath);
        } else if (file === "manifest.json") {
          try {
            const manifestContent = fs.readFileSync(filePath, "utf8");
            const manifestData = JSON.parse(manifestContent);

            if (Array.isArray(manifestData.modules)) {
              manifestData.modules.forEach((module) => {
                if (module && module.type) {
                  if (module.type === "data" || module.type === "script") {
                    this.bpFolderPaths.push(filePath);
                    this.#hasBpManifest = true;
                  } else if (module.type === "resources") {
                    this.rpFolderPaths.push(filePath);
                    this.#hasRpManifest = true;
                  }
                } else {
                  console.error(
                    `Invalid manifest structure in ${filePath}. 'modules' or 'type' not found or improperly formatted.`
                  );
                }
              });
            } else {
              console.error(
                `Invalid manifest structure in ${filePath}. 'modules' is not an array.`
              );
            }
          } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
          }
        }
      });

      // Check after processing manifestData.modules
      if (!this.#hasBpManifest) {
        checkFolderNames(
          currentPath,
          /(bp0|Behavior|BP|_BP)/i,
          this.bpFolderPaths
        );
      }
      if (!this.#hasRpManifest) {
        checkFolderNames(
          currentPath,
          /(rp0|Resource|RP|_RP)/i,
          this.rpFolderPaths
        );
      }

      function  checkFolderNames(currentPath, pattern, targetArray) {
        const folders = fs.readdirSync(currentPath);
        folders.forEach((folder) => {
          const folderPath = path.join(currentPath, folder);
          const stat = fs.statSync(folderPath);
          if (stat.isDirectory() && pattern.test(folder)) {
            targetArray.push(folderPath);
          }
        });
      }
    };

    traverseDirectory(rootPath);
  }
  #startWatchFiles() {
    const renameWatcher = vscode.workspace.createFileSystemWatcher( `{${this.bpFolderPaths[0]},${this.rpFolderPaths[0]}}/**/*.json`, true, false, false );
    renameWatcher.onDidChange(async (uri) => {
      if (uri.fsPath.includes(`${this.bpFolderPaths[0]}`)) { 
        if (uri.fsPath.includes(`\\animation_controllers`)); { addSuffixToFile(uri.fsPath, 'bpac')}
        if (uri.fsPath.includes(`\\animations`)); { addSuffixToFile(uri.fsPath, 'bpa')}
        if (uri.fsPath.includes(`\\dialogue`)); { addSuffixToFile(uri.fsPath, 'dialogue')}
        if (uri.fsPath.includes(`\\entities`)) { addSuffixToFile(uri.fsPath, 'bpe') }
        if (uri.fsPath.includes(`\\items`)) { addSuffixToFile(uri.fsPath, 'bpi') }
        if (uri.fsPath.includes(`\\loot_tables`)); { addSuffixToFile(uri.fsPath, 'loot')}
        if (uri.fsPath.includes(`\\recipes`)); { addSuffixToFile(uri.fsPath, 'r')}
        if (uri.fsPath.includes(`\\spawn_rules`)); { addSuffixToFile(uri.fsPath, 'spawn')}
        if (uri.fsPath.includes(`\\trading`)); { addSuffixToFile(uri.fsPath, 'trade')}
       }
      if (uri.fsPath.includes(`${this.rpFolderPaths[0]}`)) { 
        if (uri.fsPath.includes(`\\animation_controllers`)); { addSuffixToFile(uri.fsPath, 'rpac')}
        if (uri.fsPath.includes(`\\animations`)); { addSuffixToFile(uri.fsPath, 'rpa')}
        if (uri.fsPath.includes(`\\attachables`)) { addSuffixToFile(uri.fsPath, 'at') }
        if (uri.fsPath.includes(`\\entity`)) { addSuffixToFile(uri.fsPath, 'rpe') }
        if (uri.fsPath.includes(`\\items`)) { addSuffixToFile(uri.fsPath, 'rpi') }
        if (uri.fsPath.includes(`\\models`)) { addSuffixToFile(uri.fsPath, 'geo') }
        if (uri.fsPath.includes(`\\particles`)) { addSuffixToFile(uri.fsPath, 'particle') }
        if (uri.fsPath.includes(`\\render_controllers`)) { addSuffixToFile(uri.fsPath, 'render') }
       }
    });

    function addSuffixToFile(filePath, suffix) {
      const fileExtension = path.extname(filePath);
      if (filePath.includes(` copy`) || filePath.includes(`.${suffix}`)) {
        return;
      }
      const newFilePath = `${filePath.replace(`${fileExtension}`,'')}.${suffix}${fileExtension}`;
      try {
        fs.renameSync(filePath, newFilePath);
      } catch (error) {
        console.error(`Error renaming ${filePath}:`, error);
        return;
      }
    };
  }
};

