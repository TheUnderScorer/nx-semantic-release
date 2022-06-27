import { Workspace } from '@nrwl/devkit';
import { readJson, tmpProjPath } from '@nrwl/nx-plugin/testing';
import { exec } from '../utils/exec';
import { omit } from 'remeda';

export const readTestAppWorkspace = () => readJson<Workspace>('workspace.json');

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// We need to remove certain env values that are set by CI, they are interfering with semantic-release
const ciEnvToRemove = [
  'GITHUB_EVENT_NAME',
  'GITHUB_RUN_ID',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKSPACE',
  'GITHUB_ACTIONS',
  'GITHUB_EVENT_PATH',
  'GITHUB_SHA',
];
export const safeRunNxCommandAsync = async (command: string) => {
  const cwd = tmpProjPath();

  await exec(`npx nx ${command}`, {
    cwd,
    env: omit(process.env, ciEnvToRemove),
  });
};
