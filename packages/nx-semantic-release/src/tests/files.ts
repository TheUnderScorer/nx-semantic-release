import { TestReleasableProject } from './types';
import path from 'path';
import { readFile, readJson } from '@nx/plugin/testing';

export const getStartPath = (
  app: TestReleasableProject,
  source: 'project' | 'build' = 'project'
) =>
  path.join(
    source === 'build' ? 'dist' : '',
    app === 'common-lib' ? 'libs' : 'apps'
  );

export const readTestAppPackageJson = (
  app: TestReleasableProject,
  source: 'project' | 'build' = 'project'
) => {
  const pkgPath = path.join(getStartPath(app, source), app, 'package.json');

  return readJson(pkgPath);
};

export const readTestAppChangelog = (app: TestReleasableProject) => {
  const changelogPath = path.join(
    getStartPath(app, 'project'),
    app,
    'CHANGELOG.md'
  );

  return readFile(changelogPath);
};
