const vscode = require('vscode');
const { commandStartServer, commandStopServer } = require('./Constants');

module.exports = class Status {
    constructor() {
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        this.setStoppedStatus();
    }

    setStartedStatus(port) {
        this.statusBar.text = `WSS Port: ${port}`;
        this.statusBar.tooltip = "Click to stop websocket server.";
        this.statusBar.command = commandStopServer;
    }
    setStoppedStatus() {
        this.statusBar.text = "Start WebSocket Server";
        this.statusBar.tooltip = "Click to start websocket server.";
        this.statusBar.command = commandStartServer;
    }

    show() { this.statusBar.show(); }

    dispose() { this.statusBar.dispose(); }
}
