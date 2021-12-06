import path from 'path';
import fs from 'fs';
import { githubClient } from './github';
import { remoteRepoName, testRepoPath } from './constants';

export const cleanupTestRepo = async () => {
  const currentCwd = process.cwd();

  process.chdir(testRepoPath);

  try {
    const gitPath = path.resolve('.git');

    if (fs.existsSync(gitPath)) {
      fs.rmdirSync(gitPath, { recursive: true });

      try {
        await githubClient.repos.delete({
          repo: remoteRepoName,
          owner: 'TheUnderScorer',
        });
      } catch (error) {
        console.error(`Failed to remove remote: ${error.message}`);
      }
    }
  } finally {
    process.chdir(currentCwd);
  }
};
