const vscode = require("vscode");
const { getConfiguration } = require("./Utils");
const { commandStartServer, commandStopServer } = require("./Constants");
const { StatusBarItemToggleable } = require("./VscStatusBar");
const { WebSocketServer } = require("ws");
const { v4: genUUID } = require("uuid");

const DEFAULT_TIMEOUT = 5000; // Default timeout for command response

class MinecraftClient {
  constructor(client, output) {
    this.client = client;
    this.output = output; // Initialize output here
    this.responseHandlers = new Map();

    this.client.on("message", (data) => {
      console.log("Message received from server: ", data.toString());
      this.output.appendLine(
        `Message received from server: ${data.toString()}`
      );

      const res = JSON.parse(data.toString());
      const handler = this.responseHandlers.get(res.header.requestId);
      if (handler) {
        handler(res.body);
        this.responseHandlers.delete(res.header.requestId);
      }
    });

    this.client.on("error", (err) => {
      console.error("WebSocket error on client: ", err);
      this.output.appendLine(`WebSocket error on client: ${err.message}`);
    });

    this.client.on("close", () => {
      console.log("Client WebSocket connection closed.");
      this.output.appendLine("Client WebSocket connection closed.");
    });
  }

  send(purpose, body, uuid = genUUID()) {
    try {
      console.log(
        ` Sending message to server: ${JSON.stringify({
          body,
          header: { requestId: uuid, messagePurpose: purpose, version: 1 },
        })}`
      );
      this.output.appendLine(
        ` Sending message to server: ${JSON.stringify({
          body,
          header: { requestId: uuid, messagePurpose: purpose, version: 1 },
        })}`
      );

      this.client.send(
        JSON.stringify({
          body,
          header: {
            requestId: uuid,
            messagePurpose: purpose,
            version: 1,
          },
        })
      );
    } catch (err) {
      console.error("Error sending message: ", err);
      this.output.appendLine(`Error sending message: ${err.message}`);
    }
  }

  sendCommand(command) {
    const uuid = genUUID();
    this.send("commandRequest", { commandLine: command }, uuid);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseHandlers.delete(uuid);
        console.error("Command response timeout");
        this.output.appendLine("Command response timeout");
        reject(new Error("Command response timeout"));
      }, DEFAULT_TIMEOUT); // Timeout configured here

      this.responseHandlers.set(uuid, (body) => {
        clearTimeout(timeout);
        console.log(`Command response received: ${body.statusMessage}`);
        this.output.appendLine(
          `Command response received: ${body.statusMessage}`
        );
        resolve({
          message: body.statusMessage,
          status: body.statusCode,
        });
      });
    });
  }

  sendMessage(message) {
    console.log(`Sending message: ${message}`);
    this.output.appendLine(`Sending message: ${message}`);
    this.sendCommand(
      "tellraw @a " + JSON.stringify({ rawtext: [{ text: message }] })
    );
  }
}

class MinecraftServer {
  constructor(port, output) {
    this.output = output; // Initialize output here
    this.server = new WebSocketServer({ port });

    if (!this.server) {
      console.error(`Failed to create server. Port ${port} might be in use.`);
      this.output.appendLine(
        `Error: Failed to create server. Port ${port} might be in use.`
      );
      throw new Error(`Failed to create server. Port ${port} might be in use.`);
    }

    console.log(`WebSocket Server is listening on port ${port}`);
    this.output.appendLine(`WebSocket Server started on port ${port}`);

    this.server.on("connection", (client) => {
      console.log("New client connected");
      this.output.appendLine("New client connected");

      client.on("message", (data) => {
        console.log("Message received from client: ", data.toString());
        this.output.appendLine(
          `Message received from client: ${data.toString()}`
        );
      });

      client.on("close", () => {
        console.log("Client disconnected");
        this.output.appendLine("Client disconnected");
      });

      client.on("error", (err) => {
        console.error("WebSocket error: ", err);
        this.output.appendLine(`WebSocket error: ${err.message}`);
      });
    });
  }

  get clients() {
    return Array.from(this.server.clients).map(
      (client) => new MinecraftClient(client, this.output) // Pass the output here
    );
  }

  dispose() {
    if (this.server) {
      this.server.close();
      console.log("WebSocket server closed.");
      this.output.appendLine("WebSocket server closed.");
    }
  }
}

module.exports = class AutoReloader {
  constructor() {
    this.output = vscode.window.createOutputChannel("MPT Auto Reloader");
    this.init();
  }

  init() {
    this.statusBarItem = new StatusBarItemToggleable(
      commandStartServer,
      commandStopServer
    );

    vscode.commands.registerCommand(commandStartServer, () => this.start());
    vscode.commands.registerCommand(commandStopServer, () => this.stop());

    this.stop();
  }

  async start() {
    const port = getConfiguration("port");
    this.startServer(port);
    const command = `/connect localhost:${port}`;
    await vscode.env.clipboard.writeText(command);
    vscode.window.showInformationMessage(`Copied to clipboard: "${command}"`);

    this.statusBarItem.enable();

    console.log("Watching files for changes...");
    this.output.appendLine("Watching files for changes...");
    this.startWatchFiles();
    this.statusBarItem.text = "Close connection";
  }

  stop() {
    if (this.watcher) this.watcher.dispose();
    if (this.server) this.server.dispose();

    this.statusBarItem.disable();

    const port = getConfiguration("port");
    this.statusBarItem.text = `Start Auto Reloader: ${port}`;
    console.log("Stopped the auto-reloader.");
    this.output.appendLine("Stopped the auto-reloader.");
  }

  dispose() {
    if (this.watcher) this.watcher.dispose();
    if (this.server) this.server.dispose();
    if (this.statusBarItem) this.statusBarItem.dispose();
    this.output.dispose();
  }

  startServer(port) {
    try {
      this.server = new MinecraftServer(port, this.output); // Pass the output here
      console.log(`Minecraft server started on port ${port}`);
      this.output.appendLine(`Minecraft server started on port ${port}`);
    } catch (error) {
      console.error("Error: ", error.message);
      this.output.appendLine(`Error: ${error.message}`);
      throw error;
    }
  }

  startWatchFiles() {
    const watcher = vscode.workspace.createFileSystemWatcher(
      "**/{scripts,functions}/**/*.{js,mcfunction}",
      false,
      false,
      false
    );

    watcher.onDidChange(async (uri) => this.handleFileChange(uri, false));
    watcher.onDidCreate(async (uri) => this.handleFileChange(uri));
    watcher.onDidDelete(async (uri) => this.handleFileChange(uri));

    this.watcher = watcher;
  }

  async handleFileChange(uri, notify = true) {
    // Debounced reload handling, avoid too many reloads in a short period
    for (const client of this.server.clients) {
      try {
        const { status, message } = await client.sendCommand("reload");
        if (status === 0 && notify) {
          client.sendMessage("[MPT Auto Reloader] Reloading was successful.");
        } else if (notify) {
          client.sendMessage(
            `[MPT Auto Reloader] Reload failed.\nError: ${message}`
          );
        }
      } catch (error) {
        console.error("Error during file change handling: ", error);
        this.output.appendLine(
          `Error during file change handling: ${error.message}`
        );
      }
    }
  }
};
