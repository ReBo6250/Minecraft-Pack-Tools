const extensionName = "minecraft-pack-tools"
const extensionVersion = "3.1.0"
const minEngineVersion = [1, 19, 50]
const commandStartServer = `${extensionName}.startServer`;
const commandStopServer = `${extensionName}.stopServer`;
const commandCreateBpManifest = `${extensionName}.bpManifest`;
const commandCreateRpManifest = `${extensionName}.rpManifest`;
const commandCreateBpRpManifest = `${extensionName}.bpRpManifest`;
const commandCreateScriptAPIManifest = `${extensionName}.scriptAPIManifest`;
const ignoredFileNames = ['.gitignore', '.gitkeep'];


module.exports = {
  commandCreateBpManifest,
  commandCreateBpRpManifest,
  commandCreateRpManifest,
  commandCreateScriptAPIManifest,
  commandStartServer,
  commandStopServer,
  extensionName,
  extensionVersion,
  ignoredFileNames,
  minEngineVersion
}