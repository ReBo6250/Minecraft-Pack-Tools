const { WebSocketServer, WebSocket } = require("ws");
const { v4: genUUID } = require("uuid");

class MinecraftClient {
    constructor(client) {
        this.client = client;
    }

    send(purpose, body, uuid = genUUID()) {
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
    }

    sendCommand(command) {
        const uuid = genUUID();
        this.send("commandRequest", { commandLine: command }, uuid);

        return new Promise((resolve) => {
            this.client.on("message", (data) => {
                const res = JSON.parse(data.toString());

                if (res.header.requestId !== uuid) {
                    return;
                }

                resolve({
                    message: res.body.statusMessage,
                    status: res.body.statusCode,
                });
            });
        });
    }

    sendMessage(message) {
        this.sendCommand(
            "tellraw @a " + JSON.stringify({ rawtext: [{ text: message }] })
        );
    }
}

class MinecraftServer {
    constructor(port) {
        this.server = new WebSocketServer({ port: port });

        if (this.server.address() === null) {
            throw Error(`Port ${port} is already in use.`);
        }
    }

    get clients() {
        return new Set(
            Array.from(this.server.clients).map(
                (client) => new MinecraftClient(client)
            )
        );
    }

    dispose() {
        this.server.close();
    }
}

module.exports = {
    MinecraftServer
};