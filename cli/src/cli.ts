import * as ncp from 'ncp';
import * as recursivereaddir from 'recursive-readdir';
import * as fs from 'fs';
import { exec } from 'child_process';

export const createProject = (projectType: number, projectName: string) => {
  const placeholderValues = new Map<string, string>();
  placeholderValues.set('projectName', projectName);
  placeholderValues.set('shortProjectName', projectName.replace('-service', ''));
  let templatePath: string;
  if (projectType === 1) {
    templatePath = `${__dirname}/templates/microservice`;
  } else if (projectType === 2) {
    templatePath = `${__dirname}/templates/npm`;
  } else {
    templatePath = `${__dirname}/templates/module`;
  }
  const workingDir = process.cwd();
  ncp(templatePath, workingDir, e => {
    if (e != null) {
      throw e;
    }
    goThroughAllFiles(workingDir, placeholderValues);
  });
};

function goThroughAllFiles(workingDir: string, placeholderValues: Map<string, string>) {
  recursivereaddir(workingDir, (e, files) => {
    if (e != null) {
      throw e;
    }
    files.forEach(file => {
      if (!fs.existsSync(file)) {
        return;
      }
      const fileContents = fs.readFileSync(file, { encoding: 'utf8' });
      const processedFileContents = replaceTokens(fileContents, placeholderValues);
      if (processedFileContents !== fileContents) {
        fs.writeFileSync(file, processedFileContents);
      }
      let processedPath = replaceTokens(file, placeholderValues);
      if (processedPath.endsWith('file.gitignore')) {
        processedPath = processedPath.replace('file.gitignore', '.gitignore');
      }
      if (processedPath !== file) {
        fs.renameSync(file, processedPath);
      }
    });
  });
  installPackages(workingDir);
}


function replaceTokens(str: string, placeholderValues: Map<string, string>) {
  if (str == null || str.length === 0) {
    return str;
  }
  placeholderValues.forEach((v, k) => {
    str = str.replace(new RegExp(`##${k}##`, 'g'), v);
  });
  return str;
}

function installPackages(workingDir: string) {
  process.chdir(workingDir);
  exec('npm i', e => {
    if (e != null) {
      throw e;
    }
    console.log('All done!');
  });
}