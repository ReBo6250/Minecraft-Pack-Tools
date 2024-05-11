const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { openNewFile } = require("./Utils");

module.exports = class AddonFilesMover {
  constructor(bpFolderPath, rpFolderPath) {
    this.#startWatcher(bpFolderPath, rpFolderPath);
  }

  #startWatcher(bpFolderPath, rpFolderPath) {
    const watcher = vscode.workspace.createFileSystemWatcher(`{${bpFolderPath},${rpFolderPath}}/**/*.json`, false, true, true);
    watcher.onDidCreate((uri) => {
      const sourcePath = uri.fsPath;
      const subextension = this.#getSubextension(uri.fsPath);
      const targetDir = uri.fsPath.includes(bpFolderPath) ? bpFolderPath : rpFolderPath;
      this.#moveFileToTargetDirectory(sourcePath, targetDir, subextension);
    });
  }

  #getSubextension(path) {
    const fileName = path.split("/").pop();
    const subextensionPattern = /\.([^.]+)\.json$/;
    const match = fileName.match(subextensionPattern);
    return match && match.length === 2 ? match[1] : null;
  }

  #moveFileToTargetDirectory(sourcePath, targetDir, subextension) {
    const targetSubDir = this.#getTargetSubdirectory(subextension);
    if (targetDir === "others") {
      return;
    }

    // Allow moving files manually in subdirectories
    if (sourcePath.includes(targetSubDir)) {
      return;
    }

    const targetPath = path.join(targetDir, targetSubDir, path.basename(sourcePath));

    // Check if the source directory exists
    if (!fs.existsSync(path.dirname(sourcePath))) {
      return;
    }
    // Check if the target directory exists
    if (!fs.existsSync(path.dirname(targetPath))) {
      return;
    }

    try {
      fs.rename(sourcePath, targetPath, () => {
        openNewFile(sourcePath, targetPath);
      });
    } catch (error) {
      console.error("Error moving file:", error);
    }
  }

  #getTargetSubdirectory(subextension) {
    switch (subextension) {
      case "at":
      case "attach":
        return "attachables";
      case "b":
        return "blocks";
      case "biome":
        return "biomes";
      case "bpa":
      case "rpa":
        return "animations";
      case "bpac":
      case "rpac":
        return "animations_controllers";
      case "bpe":
        return "entities";
      case "bpi":
      case "rpi":
        return "items";
      case "geo":
        return "models";
      case "loot":
      case "lt":
        return "loot_tables";
      case "p":
      case "particle":
        return "particles";
      case "recipe":
        return "recipes";
      case "render":
        return "render_controllers";
      case "rpe":
        return "entiy";
      case "spawn":
        return "spawn_rules";
      case "trade":
        return "trading";
      default:
        return "other";
    }
  }
};
