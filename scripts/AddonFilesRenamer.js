const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { openNewFile } = require("./Utils");
/**
 * Automatically rename files in the addon folders.
 * @param { string } bpFolderPath
 * @param { string } rpFolderPath
 */
module.exports = class AddonFilesRenamer {
  constructor(bpFolderPath, rpFolderPath) {
    this.#startWatcher(bpFolderPath, rpFolderPath);
  }

  #startWatcher(bpFolderPath, rpFolderPath) {
    const watcher = vscode.workspace.createFileSystemWatcher(`{${bpFolderPath},${rpFolderPath}}/**/*.json`, true, false, true);
    watcher.onDidChange(async (uri) => {
      if (uri.fsPath.includes(bpFolderPath)) {
        const key = uri.fsPath.replace(bpFolderPath, "").split("\\")[1];
        switch (key) {
          case "animation_controllers":
            addSuffixToFile(uri.fsPath, "bpac");
            break;
          case "animations":
            addSuffixToFile(uri.fsPath, "bpa");
            break;
          case "dialogue":
            addSuffixToFile(uri.fsPath, "dialogue");
            break;
          case "entities":
            addSuffixToFile(uri.fsPath, "bpe");
            break;
          case "items":
            addSuffixToFile(uri.fsPath, "bpi");
            break;
          case "recipes":
            addSuffixToFile(uri.fsPath, "r");
            break;
          case "spawn_rules":
            addSuffixToFile(uri.fsPath, "spawn");
            break;
          case "trading":
            addSuffixToFile(uri.fsPath, "trade");
            break;
          default:
            break;
        }
        return;
      }
      if (uri.fsPath.includes(`${rpFolderPath}`)) {
        const key = uri.fsPath.replace(bpFolderPath, "").split("\\")[1];
        switch (key) {
          case "animation_controllers":
            addSuffixToFile(uri.fsPath, "rpac");
            break;
          case "animations":
            addSuffixToFile(uri.fsPath, "rpa");
            break;
          case "attachables":
            addSuffixToFile(uri.fsPath, "at");
            break;
          case "entity":
            addSuffixToFile(uri.fsPath, "rpe");
            break;
          case "items":
            addSuffixToFile(uri.fsPath, "rpi");
            break;
          case "models":
            addSuffixToFile(uri.fsPath, "geo");
            break;
          case "particles":
            addSuffixToFile(uri.fsPath, "particle");
            break;
          case "render_controllers":
            addSuffixToFile(uri.fsPath, "render");
            break;
          default:
            break;
        }
        return;
      }
    });

    function addSuffixToFile(filePath, suffix) {
      const fileExtension = path.extname(filePath);
      if (filePath.includes(` copy`) || filePath.includes(`.${suffix}`)) {
        return;
      }
      const newFilePath = `${filePath.replace(`${fileExtension}`, "")}.${suffix}${fileExtension}`;

      try {
        fs.renameSync(filePath, newFilePath);

        openNewFile(filePath, newFilePath);
      } catch (error) {}
    }
  }
};
