import { setupTestRepo } from '../../tests/setup-test-repo';
import { cleanupTestRepo } from '../../tests/cleanup-test-repo';
import { testRepoPath } from '../../tests/constants';
import { exec } from '../../utils/exec';
import { getCommitTag, getTestRepoCommits } from '../../tests/git';
import {
  readTestAppChangelog,
  readTestAppPackageJson,
} from '../../tests/files';
import { assertReleaseNotes } from '../../tests/release-notes';
import { TestApp, TestRepoCommit } from '../../tests/types';
import { omit } from 'remeda';
import fs from 'fs';
import path from 'path';
import { PackageJson } from 'type-fest';

const removeCiEnv = () =>
  omit(process.env, [
    'GITHUB_EVENT_NAME',
    'GITHUB_RUN_ID',
    'GITHUB_REPOSITORY',
    'GITHUB_WORKSPACE',
    'GITHUB_ACTIONS',
  ]);

const findReleaseCommit = (app: TestApp, commits: TestRepoCommit[]) => {
  const match = [`chore(${app})`, 'release'];

  const result = commits.find((commit) =>
    match.every((part) => commit.subject.includes(part))
  );

  if (!result) {
    console.log(commits.map((commit) => commit.subject));
    throw new Error(`Could not find release commit for ${app}`);
  }

  return result;
};

async function checkCommonLib() {
  const commits = getTestRepoCommits();
  const releaseCommit = findReleaseCommit('common-lib', commits);

  const tag = await getCommitTag(releaseCommit.hash);

  expect(tag).toEqual('common-lib-v1.0.0');

  const pkg = readTestAppPackageJson('common-lib');
  const buildPkg = readTestAppPackageJson('common-lib', 'build');

  expect(pkg.version).toEqual('1.0.0');
  expect(buildPkg.version).toEqual('1.0.0');

  const changelog = readTestAppChangelog('common-lib');

  assertReleaseNotes({
    notes: changelog,
    shouldContain: ['add common-lib', '1.0.0', 'add rest'],
    shouldNotContain: [
      'add app-a',
      'add app-b',
      'add app-a libs',
      'update test.txt',
      'update test.txt again',
      'add test-only.txt',
    ],
  });
}

async function checkAppB() {
  const commits = getTestRepoCommits();
  const releaseCommit = findReleaseCommit('app-b', commits);
  const commonLibReleaseCommit = findReleaseCommit('common-lib', commits);

  const packageJson = JSON.parse(
    fs
      .readFileSync(
        path.join(testRepoPath, 'apps', 'app-b', 'stuff', 'package.json')
      )
      .toString()
  ) as PackageJson;
  const tag = await getCommitTag(releaseCommit.hash);
  const commonLibTag = await getCommitTag(commonLibReleaseCommit.hash);

  expect(tag).toEqual('app-b-v1.0.0');
  expect(commonLibTag).toEqual('common-lib-v1.0.0');
  expect(packageJson.version).toEqual('1.0.0');

  const changelog = readTestAppChangelog('app-b');

  assertReleaseNotes({
    notes: changelog,
    shouldContain: [
      'add app-b',
      'add common-lib',
      'update test.txt',
      'update test.txt again',
      'add rest',
      'add test-only.txt',
    ],
    shouldNotContain: ['add app-a', 'add app-a libs'],
  });
}

async function checkAppA() {
  const commits = getTestRepoCommits();
  const releaseCommit = findReleaseCommit('app-a', commits);
  const commonLibReleaseCommit = findReleaseCommit('common-lib', commits);

  const tag = await getCommitTag(releaseCommit.hash);
  const commonLibTag = await getCommitTag(commonLibReleaseCommit.hash);

  expect(tag).toEqual('app-a-v1.0.0');
  // If properly configured dependencies should be released as well, common-lib is dependency to lib-a which app-a uses
  expect(commonLibTag).toEqual('common-lib-v1.0.0');

  const pkg = readTestAppPackageJson('app-a');
  const buildPkg = readTestAppPackageJson('app-a', 'build');

  expect(pkg.version).toEqual('1.0.0');
  expect(buildPkg.version).toEqual('1.0.0');

  const changelog = readTestAppChangelog('app-a');

  assertReleaseNotes({
    notes: changelog,
    shouldContain: [
      'add app-a',
      'add app-a libs',
      'add common-lib',
      'add rest',
    ],
    shouldNotContain: [
      'add app-b',
      'update test.txt',
      'update test.txt again',
      'add description',
      'add test-only.txt',
    ],
  });
}

describe('Semantic release', () => {
  beforeEach(async () => {
    process.chdir(testRepoPath);

    await setupTestRepo();
  });

  afterEach(async () => {
    await cleanupTestRepo();
  });

  describe('Independent mode', () => {
    it('should release package if itself or dependencies were changed - app-a', async () => {
      await exec('npx nx run app-a:semantic-release --skip-nx-cache', {
        verbose: true,
        env: removeCiEnv(),
      });

      await checkAppA();
    });

    it('should release package if itself or dependencies were changed - common-lib', async () => {
      await exec('npx nx run common-lib:semantic-release --skip-nx-cache', {
        verbose: true,
        env: removeCiEnv(),
      });

      await checkCommonLib();
    });

    it('should release package if itself or dependencies were changed - app-b', async () => {
      await exec('npx nx run app-b:semantic-release --skip-nx-cache', {
        verbose: true,
        env: removeCiEnv(),
      });

      await checkAppB();
    });

    it('should support parallel releases with --parallel=1 flag', async () => {
      await exec(
        'npx nx run-many --target=semantic-release --all --parallel=1 --skip-nx-cache',
        {
          verbose: true,
          env: removeCiEnv(),
        }
      );

      await checkAppA();
      await checkAppB();
      await checkCommonLib();
    });

    it('should support passing writerOpts and parserOpts', async () => {
      await exec('npx nx run app-c:semantic-release --skip-nx-cache', {
        verbose: true,
        env: removeCiEnv(),
      });

      const changelog = readTestAppChangelog('app-c');

      expect(changelog).not.toContain('### Features');
      expect(changelog).toContain(`### BREAKING CHANGES

* Test`);

      assertReleaseNotes({
        notes: changelog,
        shouldContain: ['add app-c', 'add rest'],
        shouldNotContain: [
          'add app-a',
          'add app-b',
          'update test.txt',
          'update test.txt again',
          'add description',
        ],
      });
    });
  });
});
