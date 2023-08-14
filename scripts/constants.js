const extensionName = "minecraft-pack-tools"
const extensionVersion = "3.1.3"
const minEngineVersion = [1, 19, 50]
const commandStartServer = `${extensionName}.startServer`;
const commandStopServer = `${extensionName}.stopServer`;
const commandCreateBpManifest = `${extensionName}.bpManifest`;
const commandCreateRpManifest = `${extensionName}.rpManifest`;
const commandCreateBpRpManifest = `${extensionName}.bpRpManifest`;
const commandCreateMcfunction = `${extensionName}.mcfunction`;
const commandCreateScriptAPIManifest = `${extensionName}.scriptAPIManifest`;
const ignoredFileNames = ['.gitignore', '.gitkeep'];
const suffixList = ['.ac','.animation_controllers', '.animation_controller', '.animation', '.anim', '.at', '.behavior', '.bpac', '.bpa', '.bpe', '.bpi', '.dialogue', '.entity', '.geo', '.loot', '.particle', '.rpac', '.rpa', '.rpe', '.rpi', '.r', '.trade'] // Order is important here.


module.exports = {
  commandCreateBpManifest,
  commandCreateBpRpManifest,
  commandCreateRpManifest,
  commandCreateScriptAPIManifest,
  commandCreateMcfunction,
  commandStartServer,
  commandStopServer,
  extensionName,
  extensionVersion,
  ignoredFileNames,
  suffixList,
  minEngineVersion
}