import { readJson, runNxCommandAsync, tmpProjPath } from '@nx/plugin/testing';
import { PackageJson } from 'type-fest';
import { generatedConfigFileName } from './create-config-file';
import {
  commitLintPreset,
  generatedCommitLintConfigName,
} from './enforce-commit-deps';
import fs from 'fs';
import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { setupTestNxWorkspace } from '../../tests/setup-test-nx-workspace';

const defaultExpectedConfig: SemanticReleaseOptions = {
  changelog: true,
  npm: true,
  github: true,
  repositoryUrl: 'test',
  branches: ['master'],
};

describe('Installer', () => {
  beforeAll(async () => {
    await setupTestNxWorkspace();
  });

  it('should create example', async () => {
    await runNxCommandAsync(
      `generate @goestav/nx-semantic-release:install --repositoryUrl=test --enforceConventionalCommits=false`
    );

    const config = readJson(generatedConfigFileName);
    expect(config).toEqual(defaultExpectedConfig);
  });

  describe('--enforceConventionalCommits', () => {
    it('should setup project to enforce conventional commits', async () => {
      await runNxCommandAsync(
        `generate @goestav/nx-semantic-release:install --repositoryUrl=test --enforceConventionalCommits`
      );

      const paths = {
        commitLintConfig: tmpProjPath(generatedCommitLintConfigName),
        releaseConfig: tmpProjPath(generatedConfigFileName),
        huskyCommitMsgHook: tmpProjPath('.husky/commit-msg'),
      };

      Object.values(paths).forEach((filePath) => {
        expect(fs.existsSync(filePath)).toBe(true);
      });

      const commitLintConfig = readJson(paths.commitLintConfig);
      const releaseConfig = readJson(paths.releaseConfig);
      const pkgJson = readJson<PackageJson>('package.json');

      expect(commitLintConfig).toEqual({
        extends: [commitLintPreset],
        rules: {},
      });
      expect(releaseConfig).toEqual(defaultExpectedConfig);

      expect(pkgJson.scripts?.prepare).toEqual('husky install');
      expect(
        Object.keys(pkgJson.devDependencies as Record<string, string>)
      ).toEqual(
        expect.arrayContaining([
          '@commitlint/cli',
          '@commitlint/config-conventional',
        ])
      );
    });
  });
});
