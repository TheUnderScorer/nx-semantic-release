import fs from 'fs-extra';
import { remoteGitPath } from './constants';
import { tmpProjPath } from '@nx/plugin/testing';
import { rimraf } from 'rimraf';

async function rmIfExists(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    try {
      await rimraf(dirPath);
    } catch (error) {
      console.warn('Failed to remove directory:', dirPath, error);
    }
  }
}

export async function removeRemoteRepoDir() {
  await rmIfExists(remoteGitPath);
}

export async function cleanupTestRepo() {
  const tmpPath = tmpProjPath();

  await rmIfExists(tmpPath);

  await removeRemoteRepoDir();
}
