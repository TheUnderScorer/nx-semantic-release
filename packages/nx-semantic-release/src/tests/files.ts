import { TestApp } from './types';
import path from 'path';
import { testRepoPath } from './constants';
import { readFileSync } from 'fs';
import { PackageJson } from 'type-fest';

const getStartPath = (app: TestApp, source: 'project' | 'build' = 'project') =>
  path.join(
    testRepoPath,
    source === 'build' ? 'dist' : '',
    app === 'common-lib' ? 'libs' : 'apps'
  );

export const readTestAppPackageJson = (
  app: TestApp,
  source: 'project' | 'build' = 'project'
) => {
  const pkgPath = path.join(getStartPath(app, source), app, 'package.json');

  return JSON.parse(readFileSync(pkgPath).toString()) as PackageJson;
};

export const readTestAppChangelog = (app: TestApp) => {
  const changelogPath = path.join(
    getStartPath(app, 'project'),
    app,
    'CHANGELOG.md'
  );

  return readFileSync(changelogPath).toString();
};
