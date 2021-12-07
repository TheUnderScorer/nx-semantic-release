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

const findReleaseCommit = (app: TestApp, commits: TestRepoCommit[]) => {
  //"commitMessage": "chore(app-b): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}"

  const match = [`chore(${app})`, 'release'];

  const result = commits.find((commit) =>
    match.every((part) => commit.subject.includes(part))
  );

  if (!result) {
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
    shouldContain: ['add common-lib', '1.0.0'],
    shouldNotContain: ['add app-a', 'add app-b', 'add app-a libs'],
  });
}

async function checkAppB() {
  const commits = getTestRepoCommits();
  const releaseCommit = findReleaseCommit('app-b', commits);
  const commonLibReleaseCommit = findReleaseCommit('common-lib', commits);

  const tag = await getCommitTag(releaseCommit.hash);
  const commonLibTag = await getCommitTag(commonLibReleaseCommit.hash);

  expect(tag).toEqual('app-b-v1.0.0');
  expect(commonLibTag).toEqual('common-lib-v1.0.0');

  const changelog = readTestAppChangelog('app-b');

  assertReleaseNotes({
    notes: changelog,
    shouldContain: ['add app-b', 'add common-lib'],
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
    shouldContain: ['add app-a', 'add app-a libs', 'add common-lib'],
    shouldNotContain: ['add app-b'],
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
      await exec('npx nx run app-a:semantic-release', { verbose: true });

      await checkAppA();
    });

    it('should release package if itself or dependencies were changed - common-lib', async () => {
      await exec('npx nx run common-lib:semantic-release', { verbose: true });

      await checkCommonLib();
    });

    it('should release package if itself or dependencies were changed - app-b', async () => {
      await exec('npx nx run app-b:semantic-release', { verbose: true });

      await checkAppB();
    });

    it('should support parallel releases with --parallel=1 flag', async () => {
      await exec(
        'npx nx run-many --target=semantic-release --all --parallel=1',
        {
          verbose: true,
        }
      );

      await checkAppA();
      await checkAppB();
      await checkCommonLib();
    });
  });
});
