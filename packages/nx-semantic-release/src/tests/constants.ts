import path from 'path';

export const remoteServerDirectory = path.resolve(
  __dirname,
  '../../../../git-server'
);

export const remoteReposDirectory = path.join(remoteServerDirectory, 'repos');

export const remoteGitPath = path.join(remoteReposDirectory, 'project.git');

export const testReleasableProjects = [
  'app-a',
  'app-b',
  'app-c',
  'common-lib',
] as const;
export const testApps = ['app-a', 'app-b', 'app-c'];
export const testLibs = [
  'common-lib',
  'lib-a',
  'lib-a-dependency',
  'lib-b',
] as const;
export const testNonReleasableLibs = ['lib-a', 'lib-a-dependency', 'lib-b'];
