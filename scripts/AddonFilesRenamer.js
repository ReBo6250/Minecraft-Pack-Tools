const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
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
    const renameWatcher = vscode.workspace.createFileSystemWatcher(
      `{${bpFolderPath},${rpFolderPath}}/**/*.json`,
      true,
      false,
      false
    );
    renameWatcher.onDidChange(async (uri) => {
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
          case "loot_tables":
            addSuffixToFile(uri.fsPath, "loot");
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
      }
    });

    function addSuffixToFile(filePath, suffix) {
      const fileExtension = path.extname(filePath);
      if (filePath.includes(` copy`) || filePath.includes(`.${suffix}`)) {
        return;
      }
      const newFilePath = `${filePath.replace(
        `${fileExtension}`,
        ""
      )}.${suffix}${fileExtension}`;
      try {
        fs.renameSync(filePath, newFilePath);
        // Close the current editor if it's associated with the modified file
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.uri.fsPath === filePath) {
          vscode.commands
            .executeCommand("workbench.action.closeActiveEditor")
            .then(() => {
              // Open the new file after closing the old one
              vscode.workspace
                .openTextDocument(newFilePath)
                .then((document) => {
                  vscode.window.showTextDocument(document);
                });
            });
        }
      } catch (error) {
        console.error(`Error renaming ${filePath}:`, error);
        return;
      }
    }
  }
};
