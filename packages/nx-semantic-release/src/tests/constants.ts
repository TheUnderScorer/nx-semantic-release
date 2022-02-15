import path from 'path';

export const testRepoPath = path.resolve(
  __dirname,
  '../../../../test-repos/app'
);

export const remoteRepoName = 'nx-semantic-release-test-repos-app';

export const commitToRevertTo = `feat: add rest`;

export const remoteServerDirectory = path.resolve(
  __dirname,
  '../../../../git-server'
);

export const remoteReposDirectory = path.join(remoteServerDirectory, 'repos');

export const remoteGitPath = path.join(remoteReposDirectory, 'project.git');

export const testProjects = ['app-a', 'app-b', 'common-lib'] as const;
