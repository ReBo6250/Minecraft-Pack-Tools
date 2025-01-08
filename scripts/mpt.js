const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const AddonFilesRenamer = require("./AddonFilesRenamer");
const AutoReloader = require("./AutoReloader_v2");
const AddonFilesMover = require("./AddonFilesMover");

class Pack {
  constructor(type, path) {
    (this.type = type), (this.path = path);
  }
}

class Addon {
  constructor(bp, rp) {
    (this.bpPath = bp.path), (this.rpPath = rp.path);
  }
}

module.exports = class MPT {
  constructor() {
    this.#initialize();
  }

  bpFolderPaths = [];
  rpFolderPaths = [];
  selectedBpFolder;
  selectedRpFolder;
  #hasBpManifest = false;
  #hasRpManifest = false;

  #initialize() {
    if (vscode.workspace.workspaceFolders) {
      vscode.workspace.workspaceFolders.forEach((folder) => {
        const folderPath = folder.uri.fsPath;
        this.#getAllManifestPaths(folderPath);
      });
      if (this.bpFolderPaths.length > 0 || this.rpFolderPaths.length > 0) {
        new AddonFilesRenamer(this.bpFolderPaths[0], this.rpFolderPaths[0]);
        new AddonFilesMover(this.bpFolderPaths[0], this.rpFolderPaths[0]);
        new AutoReloader();
      }
      console.log("MPT is now active");
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
                  if (module.type === "data") {
                    this.bpFolderPaths.push(currentPath);
                    this.#hasBpManifest = true;
                  } else if (module.type === "resources") {
                    this.rpFolderPaths.push(currentPath);
                    this.#hasRpManifest = true;
                    return;
                  }
                } else {
                  console.error(`Invalid manifest structure in ${filePath}. 'modules' or 'type' not found or improperly formatted.`);
                }
              });
            } else {
              console.error(`Invalid manifest structure in ${filePath}. 'modules' is not an array.`);
            }
          } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
          }
        }
      });

      // Check after processing manifestData.modules
      if (!this.#hasBpManifest) {
        checkFolderNames(currentPath, /(bp0|Behavior|BP|_BP)/i, this.bpFolderPaths);
      }
      if (!this.#hasRpManifest) {
        checkFolderNames(currentPath, /(rp0|Resource|RP|_RP)/i, this.rpFolderPaths);
      }

      function checkFolderNames(currentPath, pattern, targetArray) {
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
};
