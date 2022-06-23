import {
  ensureNxProject,
  getCwd,
  readJson,
  runNxCommandAsync,
  runPackageManagerInstall,
  tmpProjPath,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import path from 'path';
import { PackageJson } from 'type-fest';
import { generatedConfigFileName } from './create-config-file';
import {
  commitLintPreset,
  generatedCommitLintConfigName,
} from './enforce-commit-deps';
import fs from 'fs';
import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';

// TODO Use testing utils for semantic-release executor as well
const defaultExpectedConfig: SemanticReleaseOptions = {
  changelog: false,
  npm: true,
  github: true,
  releaseRules: 'test',
  branches: ['master'],
};

describe('Installer', () => {
  beforeAll(() => {
    ensureNxProject(
      '@theunderscorer/nx-semantic-release',
      'dist/packages/nx-semantic-release'
    );

    updateFile('package.json', (contents) => {
      const pkg = JSON.parse(contents) as PackageJson;

      pkg.devDependencies = {
        ...pkg.devDependencies,
        '@theunderscorer/nx-semantic-release': `file:${path.resolve(
          getCwd(),
          'dist/packages/nx-semantic-release'
        )}`,
      };

      return JSON.stringify(pkg, null, 2);
    });

    runPackageManagerInstall();
  });

  afterAll(() => {
    runNxCommandAsync('reset');
  });

  it('should create example', async () => {
    await runNxCommandAsync(
      `generate @theunderscorer/nx-semantic-release:install --repositoryUrl=test --enforceConventionalCommits=false`
    );

    const config = readJson(generatedConfigFileName);
    expect(config).toEqual(defaultExpectedConfig);
  });

  describe('--enforceConventionalCommits', () => {
    it('should setup project to enforce conventional commits', async () => {
      await runNxCommandAsync(
        `generate @theunderscorer/nx-semantic-release:install --repositoryUrl=test --enforceConventionalCommits`
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
