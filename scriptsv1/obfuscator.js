const fs = require('fs');

function obfuscateJSON(filePath, outputFilePath) {
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        
        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);

            // Obfuscate JSON data by converting characters to hexadecimal code points
            const obfuscatedData = obfuscateObject(jsonData);

            // Write the obfuscated JSON to a new file
            fs.writeFile(outputFilePath, JSON.stringify(obfuscatedData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing obfuscated JSON file:', err);
                    return;
                }
                console.log('JSON obfuscation complete. Obfuscated JSON saved to', outputFilePath);
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
}

function obfuscateObject(obj) {
    const obfuscatedObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            obfuscatedObj[obfuscateString(key)] = obfuscateObject(obj[key]);
        } else {
            obfuscatedObj[obfuscateString(key)] = obfuscateValue(obj[key]);
        }
    }
    return obfuscatedObj;
}

function obfuscateString(str) {
    return str.replace(/./g, char => {
        const codePoint = char.charCodeAt(0).toString(16).padStart(4, '0');
        return `\\u${codePoint}`;
    });
}

function obfuscateValue(value) {
    if (typeof value === 'string') {
        return value.replace(/./g, char => {
            const codePoint = char.charCodeAt(0).toString(16).padStart(4, '0');
            return `\\u${codePoint}`;
        });
    }
    return value;
}

// Example usage:
const inputFile = 'D:/My Files/GitHub/ReBo/minecraft-pack-tools/scriptsv1/load.json'; // Path to your JSON file
const outputFile = 'D:/My Files/GitHub/ReBo/minecraft-pack-tools/scriptsv1/output.json'; // Path to save the obfuscated content
obfuscateJSON(inputFile, outputFile);
