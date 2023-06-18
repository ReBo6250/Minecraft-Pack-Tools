const { v4: uuidv4 } = require('uuid')
const { extensionVersion, minEngineVersion } = require('./constants');


const bpUuid = uuidv4()
const rpUuid = uuidv4()

module.exports.Bp=bp();
module.exports.Rp=rp();
module.exports.BpWithDependencies=bpWithDependencies();
module.exports.RpWithDependencies=rpWithDependencies();
module.exports.ScriptAPI=scriptAPI();

function bp () {
    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: bpUuid,
            version: [1, 0, 0],
            min_engine_version: minEngineVersion
        },
        metadata: {
            authors: ["pack.authors"],
            generated_with: {
                minecraft_pack_tools: [extensionVersion]
            }
        },
        modules: [
            {
                description: "pack.description",
                version: [1, 0, 0], 
                uuid: uuidv4(),
                type: "data"
            }
        ]
    }
}

function bpWithDependencies() {
    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: bpUuid,
            version: [1, 0, 0],
            min_engine_version: minEngineVersion
         },
         metadata: {
            authors: ["pack.authors"],
            generated_with: {
                minecraft_pack_tools: [extensionVersion]
            }
        },
        modules: [
            {
                description: "pack.description",
                version: [1, 0, 0], 
                uuid: uuidv4(),
                type: "data"
            }
        ],
        dependencies: [
            {
                uuid: rpUuid,
                version: [1, 0, 0]
            }
        ]
    }
}

function rp() {
    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: rpUuid,
            version: [1, 0, 0],
            min_engine_version: minEngineVersion
        },
        metadata: {
            authors: ["pack.authors"],
            generated_with: {
                minecraft_pack_tools: [extensionVersion]
            }
        },
        modules: [
            {
                description: "pack.description",
                version: [1, 0, 0], 
                uuid: uuidv4(),
                type: "resources"
            }
        ]
    }
}

function rpWithDependencies() {
    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: rpUuid,
            version: [1, 0, 0],
            min_engine_version: minEngineVersion
         },
         metadata: {
            authors: ["pack.authors"],
            generated_with: {
                minecraft_pack_tools: [extensionVersion]
            }
        },
        modules: [
            {
                description: "pack.description",
                version: [1, 0, 0], 
                uuid: uuidv4(),
                type: "resources"
            }
        ],
        dependencies: [
            {
                uuid: bpUuid,
                version: [1, 0, 0]
            }
        ]
    }
}

function scriptAPI() {
    return {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: uuidv4(),
            version: [ 1, 0, 0 ],
            min_engine_version: minEngineVersion
        },
        metadata: {
            authors: ["pack.authors"],
            generated_with: {
                minecraft_pack_tools: [extensionVersion]
            }
        },
        modules: [
            {
                type: "script",
                language: "javascript",
                uuid: uuidv4(),
                entry: "scripts/server/script.js",
                version: [ 1, 0, 0 ]
            }
        ],
        capabilities: [ "script_eval" ],
        dependencies: [
            {
                module_name: "@minecraft/server",
                version: "1.1.0-beta"
            },
            {
                module_name: "@minecraft/server-ui",
                version: "1.0.0-beta"
            }
        ]
    }
}










