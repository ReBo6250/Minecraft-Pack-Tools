var fs = require('fs');
const { readdir } = require('fs').promises;
const vscode = require('vscode');


module.exports = {
  filesInFolder
}

function filesInFolder(parentFolderPath, targetExtension, subExtension) {
  if(!fs.existsSync(parentFolderPath)) {return;}
  getFilePaths(parentFolderPath).then((filePaths) => { 
    filePaths.forEach(filePath => {
      let newFilePath;

      

      if (filePath.includes(`${subExtension} copy${targetExtension}`)) {
        newFilePath = filePath.replace(`${subExtension} copy${targetExtension}`, `${subExtension}${targetExtension}`)
        let index = 2;

        while (fs.existsSync(newFilePath)) {
          newFilePath =  filePath.replace(`${subExtension} copy${targetExtension}`, `${index}${subExtension}${targetExtension}`)
          index++;
          if (!fs.existsSync(newFilePath)) { 
            fs.rename(filePath, newFilePath, (error) => { if (error) console.log(error)});
            break; 
          }
        }
      }
      if (!filePath.includes(`.`) || (!filePath.includes(`${subExtension}${targetExtension}`) && !filePath.includes(`${subExtension} copy`))) {
        const SubExtensionList = ['.ac', '.animation_controller', '.animation', '.anim', '.at', '.behavior', '.bpac', '.bpa', '.bpe', '.bpi', '.dialogue', '.entity', '.geo', '.loot', '.particle', '.rpac', '.rpa', '.rpe', '.rpi', '.r', '.trade'] // Order is important here.
        for (let index = 0; index < SubExtensionList.length; index++) {
          const subExtensionListElement = SubExtensionList[index];
          if (filePath.includes(`${subExtensionListElement}`)) {
            newFilePath = filePath.replace(`.${subExtensionListElement}${targetExtension}`, `${subExtension}${targetExtension}`);
            break;
          }
          else if(subExtensionListElement === SubExtensionList[SubExtensionList.length - 1]){
            if (!filePath.includes(`.`)) {
              newFilePath = filePath.replace(`${filePath}`, `${filePath}${subExtension}${targetExtension}`);
          }
            else {
              newFilePath = filePath.replace(`${targetExtension}`, `${subExtension}${targetExtension}`);
            }
          }
        }
        console.log(filePath);
        console.log(newFilePath);
        fs.rename(filePath, newFilePath, (error) => { if (error) console.log(error)});
        
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








