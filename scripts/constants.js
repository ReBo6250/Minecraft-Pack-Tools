const extensionName = "minecraft-pack-tools"
const extensionVersion = "3.0.0"
const minEngineVersion = [1, 19, 50]
const startServerCommand = `${extensionName}.startServer`;
const stopServerCommand = `${extensionName}.stopServer`;



module.exports = {
  extensionName,
  extensionVersion,
  minEngineVersion,
  startServerCommand,
  stopServerCommand
}