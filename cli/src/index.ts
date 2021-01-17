#!/usr/bin/env node

import * as reader from 'readline-sync';
import { createProject } from './cli';

console.log('What kind of project do you want in this folder?');
console.log('1) Microservice');
console.log('2) NPM Module');
console.log('3) rpstar Module');
let projectType: number;
while (true) {
  projectType = reader.questionInt('Project Type: ');
  if (projectType !== 1 && projectType !== 2 && projectType !== 3) {
    console.error('Invalid choice.');
    continue;
  }
  break;
}
let projectName: string;
while (true) {
  projectName = reader.question('Project Name: ');
  if (projectName == null || projectName.length === 0) {
    console.error('Invalid name.');
    continue;
  }
  break;
}
createProject(projectType, projectName);