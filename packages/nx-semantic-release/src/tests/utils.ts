import { readJsonFile, Workspace } from '@nrwl/devkit';
import * as path from 'path';
import { testRepoPath } from './constants';

export const readTestAppWorkspace = () =>
  readJsonFile<Workspace>(path.join(testRepoPath, 'workspace.json'));

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
