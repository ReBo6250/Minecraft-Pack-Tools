const { v4: uuidv4 } = require('uuid')

const bpUuid = uuidv4()
const rpUuid = uuidv4()
const minEngineVersion = '1, 19, 50'

module.exports.Bp=bp();
module.exports.Rp=rp();
module.exports.BpWithDependencies=bpWithDependencies();
module.exports.RpWithDependencies=rpWithDependencies();

function bp() {
    let string;
    string =
`{\n\
    "format_version": 2,\n\
    "header": {\n\
        "name": "pack.name",\n\
        "description": "pack.description",\n\
        "uuid": "${bpUuid}",\n\
        "version": [1, 0, 0],\n\
        "min_engine_version": [${minEngineVersion}]\n\
    },\n\
    "metadata": {\n\
        "authors": ["pack.authors"]\n\
        },\n\
        "modules": [\n\
            {\n\
                "description": "pack.description",\n\
            "version": [1, 0, 0], \n\
             "uuid": "${uuidv4()}",\n\
            "type": "data"\n\
        }\n\
    ]\n\
}`;
    return string;
}

function bpWithDependencies() {
    let string;
    string =
`{\n\
    "format_version": 2,\n\
    "header": {\n\
        "name": "pack.name",\n\
        "description": "pack.description",\n\
        "uuid": "${bpUuid}",\n\
        "version": [1, 0, 0],\n\
        "min_engine_version": [${minEngineVersion}]\n\
    },\n\
    "metadata": {\n\
        "authors": ["pack.authors"]\n\
        },\n\
        "modules": [\n\
            {\n\
                "description": "pack.description",\n\
            "version": [1, 0, 0], \n\
             "uuid": "${uuidv4()}",\n\
            "type": "data"\n\
        }\n\
    ],\n\
	"dependencies": [\n\
		{\n\
             "uuid": "${rpUuid}",\n\
			"version": [1, 0, 0]\n\
		}\n\
	]\n\
}`;
    return string;
}

function rp() {
    let string;
    string =
`{\n\
    "format_version": 2,\n\
    "header": {\n\
        "name": "pack.name",\n\
        "description": "pack.description",\n\
        "uuid": "${rpUuid}",\n\
        "version": [1, 0, 0],\n\
        "min_engine_version": [${minEngineVersion}]\n\
    },\n\
    "metadata": {\n\
        "authors": ["pack.authors"]\n\
        },\n\
        "modules": [\n\
            {\n\
                "description": "pack.description",\n\
            "version": [1, 0, 0], \n\
             "uuid": "${uuidv4()}",\n\
            "type": "resources"\n\
        }\n\
    ]\n\
}`;
    return string;
}

function rpWithDependencies() {
    let string;
    string =
`{\n\
    "format_version": 2,\n\
    "header": {\n\
        "name": "pack.name",\n\
        "description": "pack.description",\n\
        "uuid": "${rpUuid}",\n\
        "version": [1, 0, 0],\n\
        "min_engine_version": [${minEngineVersion}]\n\
    },\n\
    "metadata": {\n\
        "authors": ["pack.authors"]\n\
        },\n\
        "modules": [\n\
            {\n\
                "description": "pack.description",\n\
            "version": [1, 0, 0], \n\
             "uuid": "${uuidv4()}",\n\
            "type": "resources"\n\
        }\n\
    ],\n\
	"dependencies": [\n\
		{\n\
             "uuid": "${bpUuid}",\n\
			"version": [1, 0, 0]\n\
		}\n\
	]\n\
}`;
    return string;
}




