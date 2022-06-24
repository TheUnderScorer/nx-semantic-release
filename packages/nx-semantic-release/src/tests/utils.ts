import { Workspace } from '@nrwl/devkit';
import { readJson } from '@nrwl/nx-plugin/testing';

export const readTestAppWorkspace = () => readJson<Workspace>('workspace.json');

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
