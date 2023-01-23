var fs = require('fs');
const { readdir } = require('fs').promises;

module.exports = {
  filesInFolder
}

function filesInFolder(parentFolderPath, targetExtension, subExtension) {
  if(!fs.existsSync(parentFolderPath)) {return;}
  getFilePaths(parentFolderPath).then((filePaths) => { 
    filePaths.forEach(filePath => {
      let newFilePath;
      if (filePath.includes(`.${subExtension} copy.${targetExtension}`)) {
        newFilePath = filePath.replace(`.${subExtension} copy.${targetExtension}`, `.${subExtension}.${targetExtension}`)
        let index = 2;

        while (fs.existsSync(newFilePath)) {
          newFilePath =  filePath.replace(`.${subExtension} copy.${targetExtension}`, `${index}.${subExtension}.${targetExtension}`)
          index++;
          if (!fs.existsSync(newFilePath)) { 
            fs.rename(filePath, newFilePath, function (err) { if (err) throw err; });
            break; 
          }
        }
      }
      if (!filePath.includes(`.${subExtension}.${targetExtension}`) && !filePath.includes(`.${subExtension} copy`)) {
        newFilePath = filePath.replace(`.${targetExtension}`, `.${subExtension}.${targetExtension}`)
        fs.rename(filePath, newFilePath, function (err) { if (err) throw err; });
      }
    });
  });
}

const getFilePaths = async (parentFolderPath) => {
  let filePaths = [];
  const files = await readdir(parentFolderPath, { withFileTypes: true });

  for (const file of files) {
      if (file.isDirectory()) { filePaths = [ ...filePaths, ...(await getFilePaths(`${parentFolderPath}/${file.name}`)), ]; } 
      else { filePaths.push(`${parentFolderPath}/${file.name}`); }
  }

  return filePaths;
};








