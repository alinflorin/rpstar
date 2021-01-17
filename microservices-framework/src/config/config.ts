import * as fs from 'fs';

export function readConfig() {
  const basePath = process.cwd();
  console.log('Reading config...');
  console.log('Base path: ' + basePath);
  const env = getEnv();
  if (!fs.existsSync(`${basePath}/config.json`)) {
    throw new Error('config.json does not exist');
  }
  const cfgFile = fs.readFileSync(`${basePath}/config.json`);
  const stringCfgFile = cfgFile.toString('utf8', 0, cfgFile.length);
  let settingsObject: any = JSON.parse(stringCfgFile);
  settingsObject.env = env;
  if (fs.existsSync(`${basePath}/config.${env}.json`)) {
    const addCfgFile = fs.readFileSync(`${basePath}/config.${env}.json`);
    const stringAddCfgFile = addCfgFile.toString('utf8', 0, addCfgFile.length);
    const addSettingsObject = JSON.parse(stringAddCfgFile);
    settingsObject = Object.assign(settingsObject, addSettingsObject);
  }
  return settingsObject;
}

export function getEnv() {
  console.log('Reading env...');
  console.log(process.env);
  if (process.env.NODE_ENV != null && process.env.NODE_ENV.length > 0) {
    return process.env.NODE_ENV.toLowerCase();
  }
  return 'dev';
}