import path from 'path';
import fs from 'fs';
import {
  remoteGitPath,
  testRepoLastCommitMessage,
  testRepoPath,
} from './constants';
import { getTestRepoCommits } from './git';
import { exec } from '../utils/exec';

async function revertToLastCommit() {
  const testRepoCommits = getTestRepoCommits();
  const targetCommit = testRepoCommits.find(
    (commit) => commit.subject === testRepoLastCommitMessage
  );

  if (!targetCommit) {
    throw new Error(
      `Unable to find target commit: "${testRepoLastCommitMessage}"`
    );
  }

  await exec(`git reset --hard ${targetCommit.hash}`);
}

function removeRemoteDockerRepo() {
  fs.rmSync(remoteGitPath, { recursive: true });
}

export const cleanupTestRepo = async () => {
  const currentCwd = process.cwd();

  process.chdir(testRepoPath);

  try {
    const gitPath = path.resolve('.git');

    if (fs.existsSync(gitPath)) {
      try {
        await revertToLastCommit();
      } catch (error) {
        console.error(error);
      }

      fs.rmSync(gitPath, { recursive: true });

      try {
        removeRemoteDockerRepo();
      } catch (error) {
        console.error(`Failed to remove remote: ${error.message}`);
      }
    }
  } finally {
    process.chdir(currentCwd);
  }
};
