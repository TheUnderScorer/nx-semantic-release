import { remoteRepoName, testRepoPath } from './constants';
import { exec } from '../utils/exec';
import gitlog from 'gitlog';
import { cleanupTestRepo } from './cleanup-test-repo';
import { githubClient } from './github';

export interface SetupTestRepoResult {
  commits: {
    hash: string;
    subject: string;
    abbrevHash: string;
  }[];
}

const setupCommands: Array<string | (() => Promise<void>)> = [
  'git init',
  'git add apps/app-a',
  'git commit -m "feat: add app-a"',
  'git add apps/app-b',
  'git commit -m "feat: add app-b"',
  'git add libs/lib-a libs/lib-a-dependency',
  'git commit -m "feat: add app-a libs"',
  'git add .',
  'git commit -m "feat: add rest"',
  async () => {
    const { data } = await githubClient.request('POST /user/repos', {
      name: remoteRepoName,
      private: true,
    });

    await exec(`git remote add origin ${data.clone_url}`);
  },
  'git push --set-upstream origin master',
];

const runCommands = async () => {
  for (const command of setupCommands) {
    if (typeof command === 'string') {
      await exec(command);
    } else {
      await command();
    }
  }
};

export const setupTestRepo = async (): Promise<SetupTestRepoResult> => {
  const currentCwd = process.cwd();

  try {
    process.chdir(testRepoPath);

    await cleanupTestRepo();

    await runCommands();

    const commits = gitlog({
      repo: './',
      fields: ['hash', 'subject', 'abbrevHash'],
    });

    return {
      commits,
    };
  } finally {
    process.chdir(currentCwd);
  }
};
