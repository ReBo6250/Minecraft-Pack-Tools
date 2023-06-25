const extensionName = "minecraft-pack-tools"
const extensionVersion = "3.0.3"
const minEngineVersion = [1, 19, 50]
const commandStartServer = `${extensionName}.startServer`;
const commandStopServer = `${extensionName}.stopServer`;
const commandCreateBpManifest = `${extensionName}.bpManifest`;
const commandCreateRpManifest = `${extensionName}.rpManifest`;
const commandCreateBpRpManifest = `${extensionName}.bpRpManifest`;
const commandCreateScriptAPIManifest = `${extensionName}.scriptAPIManifest`;



module.exports = {
  extensionName,
  commandCreateBpManifest,
  commandCreateRpManifest,
  commandCreateBpRpManifest,
  commandCreateScriptAPIManifest,
  extensionVersion,
  minEngineVersion,
  commandStartServer,
  commandStopServer
}