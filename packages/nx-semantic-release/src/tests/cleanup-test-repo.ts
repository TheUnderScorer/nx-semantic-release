import fs from 'fs';
import { remoteGitPath } from './constants';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';

export function removeRemoteRepoDir() {
  if (fs.existsSync(remoteGitPath)) {
    fs.rmSync(remoteGitPath, { recursive: true });
  }
}

export function cleanupTestRepo() {
  if (fs.existsSync(tmpProjPath())) {
    fs.rmSync(tmpProjPath(), { recursive: true });
  }

  removeRemoteRepoDir();
}
