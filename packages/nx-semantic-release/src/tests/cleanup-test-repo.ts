import fs from 'fs';
import { remoteGitPath } from './constants';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';

export function removeRemoteRepoDir() {
  if (fs.existsSync(remoteGitPath)) {
    fs.rmSync(remoteGitPath, { recursive: true });
  }
}

export function cleanupTestRepo() {
  const tmpPath = tmpProjPath();

  if (fs.existsSync(tmpPath)) {
    fs.rmSync(tmpPath, { recursive: true });
  }

  removeRemoteRepoDir();
}
