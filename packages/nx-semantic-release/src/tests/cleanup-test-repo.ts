import fs from 'fs';
import { remoteGitPath } from './constants';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';

function rmIfExists(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
  }
}

export function removeRemoteRepoDir() {
  rmIfExists(remoteGitPath);
}

export function cleanupTestRepo() {
  const tmpPath = tmpProjPath();

  rmIfExists(tmpPath);

  removeRemoteRepoDir();
}
