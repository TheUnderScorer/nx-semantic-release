import {
  runCommandsInTestProj,
  setupTestRepo,
} from '../../tests/setup-test-repo';
import { getCommitTag, getTestRepoCommits } from '../../tests/git';
import {
  readTestAppChangelog,
  readTestAppPackageJson,
} from '../../tests/files';
import { assertReleaseNotes } from '../../tests/release-notes';
import { PackageJson } from 'type-fest';
import { readJson } from '@nx/plugin/testing';
import { safeRunNxCommandAsync } from '../../tests/utils';
import { findReleaseCommit } from '../../tests/find-release-commit';

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

  const packageJson = readJson<PackageJson>('apps/app-b/stuff/package.json');
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
  const builtLibPkg = readTestAppPackageJson('common-lib', 'build');

  expect(pkg.version).toEqual('1.0.0');
  expect(builtLibPkg.version).toEqual('1.0.0');

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
    await setupTestRepo();
  });

  describe('Independent mode', () => {
    it('should release package if itself or dependencies were changed - app-a', async () => {
      await safeRunNxCommandAsync('run app-a:semantic-release');

      await checkAppA();
    });

    it('should release package if itself or dependencies were changed - common-lib', async () => {
      await safeRunNxCommandAsync('run common-lib:semantic-release');

      await checkCommonLib();
    });

    it('should release package if itself or dependencies were changed - app-b', async () => {
      await safeRunNxCommandAsync('run app-b:semantic-release');

      await checkAppB();
    });

    it('should support parallel releases with --parallel=1 flag', async () => {
      await safeRunNxCommandAsync(
        'run-many --target=semantic-release --all --parallel=1'
      );

      await checkAppA();
      await checkAppB();
      await checkCommonLib();
    });

    it.only('should support passing false to release in releaseRules and respect it', async () => {
      await safeRunNxCommandAsync('run app-a:semantic-release');

      await runCommandsInTestProj([
        'echo "no-release-test" > apps/app-a/no-release-test.txt',
        'git add apps/app-a/no-release-test.txt',
        'git commit -m "feat(release-test): update no-release-test.txt"',
      ]);

      await safeRunNxCommandAsync('run app-a:semantic-release');

      const changelog = readTestAppChangelog('app-a');
      const pkg = readTestAppPackageJson('app-a');

      expect(changelog).not.toContain('update no-release-test.txt');
      expect(pkg.version).toEqual('1.0.0');
    });

    it('should support passing writerOpts and parserOpts', async () => {
      await safeRunNxCommandAsync('run app-c:semantic-release');

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
