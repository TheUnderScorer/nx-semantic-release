import {
  remoteGitPath,
  remoteReposDirectory,
  commitToRevertTo,
  testRepoPath,
} from './constants';
import { exec } from '../utils/exec';
import { cleanupTestRepo } from './cleanup-test-repo';
import { getTestRepoCommits } from './git';
import { TestRepoCommit } from './types';
import { wait } from './utils';
import fs from 'fs';
import path from 'path';
import { PackageJson } from 'type-fest';

export interface SetupTestRepoResult {
  commits: TestRepoCommit[];
}

async function setupRemoteRepo() {
  await wait(250);

  if (!fs.existsSync(remoteReposDirectory)) {
    fs.mkdirSync(remoteReposDirectory, { recursive: true });
  }

  await exec(`git init --bare project.git`, {
    cwd: remoteReposDirectory,
    verbose: true,
  });
}

async function addDescriptionToPkgJson() {
  const pkgPath = path.join(testRepoPath, 'apps/app-a/package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as PackageJson;

  pkg.description = 'Test repo';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

const setupCommands: Array<string | (() => Promise<void>)> = [
  setupRemoteRepo,
  'git init',
  'git config user.email "test@example.com"',
  'git config user.name "Test"',
  'git add apps/app-a',
  'git commit -m "feat: add app-a"',
  'git add apps/app-b',
  'git commit -m "feat: add app-b"',
  'git add libs/lib-a libs/lib-a-dependency',
  'git commit -m "feat: add app-a libs"',
  'git add libs/common-lib',
  'git commit -m "feat: add common-lib"',
  'git add .',
  `git commit -m "${commitToRevertTo}"`,
  'echo "Test123" > apps/app-b/test.txt',
  'git add apps/app-b/test.txt',
  'git commit -m "feat: update test.txt"',
  'echo "Test123456" > apps/app-b/test.txt',
  'git add apps/app-b/test.txt',
  'git commit -m "feat: update test.txt again"',
  addDescriptionToPkgJson,
  'git add apps/app-a/package.json',
  'git commit -m "feat: add description\n\n[skip app-a]"',
  `git remote add origin ${remoteGitPath}`,
  'git push origin master',
];

async function runCommands() {
  for (const command of setupCommands) {
    if (typeof command === 'string') {
      await exec(command);
    } else {
      await command();
    }
  }
}

export async function setupTestRepo(): Promise<SetupTestRepoResult> {
  const currentCwd = process.cwd();

  process.chdir(testRepoPath);

  try {
    await cleanupTestRepo();

    await runCommands();

    const commits = getTestRepoCommits();

    return {
      commits,
    };
  } finally {
    process.chdir(currentCwd);
  }
}
