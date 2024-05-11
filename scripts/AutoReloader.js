const vscode = require("vscode");
var Status = require("./Status");
const { getConfiguration } = require("./Utils");
const { MinecraftServer } = require("./MinecraftServer");
const { commandStartServer, commandStopServer } = require("./Constants");

module.exports = class AutoReloader {
  constructor() {
    this.init();
  }

  init() {
    this.status = new Status();
    this.status.show();

    this.output = vscode.window.createOutputChannel("Minecraft Auto Reloader");

    vscode.commands.registerCommand(commandStartServer, () => this.start());
    vscode.commands.registerCommand(commandStopServer, () => this.stop());
  }

  start() {
    const port = getConfiguration("port");
    this.startServer(port);

    this.status.setStartedStatus(port);
    this.output.appendLine(`Websocket server opened on port ${port}.`);

    this.startWatchFiles();
  }

  stop() {
    this.watcher.dispose();
    this.server.dispose();
    this.status.setStoppedStatus();

    this.output.appendLine(`Websocket server closed.`);
  }

  dispose() {
    this.watcher.dispose();
    this.server.dispose();
    this.status.dispose();
    this.output.dispose();
  }

  startServer(port) {
    this.server = new MinecraftServer(port);
  }

  startWatchFiles() {
    const watcher = vscode.workspace.createFileSystemWatcher("**/{scripts,functions}/**/*.{js,mcfunction}", false, false, false);
    watcher.onDidChange(async (uri) => {
      setTimeout(async () => {
        await this.reloadSilent(uri);
      }, 500);
      await this.reload(uri);
    });

    watcher.onDidCreate(async (uri) => await this.reload(uri));
    watcher.onDidDelete(async (uri) => await this.reload(uri));

    this.watcher = watcher;
  }

  async reload(uri) {
    for (const client of this.server.clients) {
      const { status, message } = await client.sendCommand("reload");
      if (status === 0) {
        return client.sendMessage("[MPT Reloader] Reloading was successful.");
      }
      client.sendMessage(`[MPT Reloader] Reload failed.\nError: ${message}`);
    }
    this.output.appendLine(`Reloaded: ${uri.fsPath}`);
  }

  async reloadSilent(uri) {
    for (const client of this.server.clients) {
      await client.sendCommand("reload");
    }

    this.output.appendLine(`Reloaded: ${uri.fsPath}`);
  }
};
