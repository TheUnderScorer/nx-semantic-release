import { SemanticReleaseOptions } from './semantic-release';

export const defaultOptions: SemanticReleaseOptions = {
  branches: [
    'master',
    'main',
    'next',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  changelog: true,
  changelogFile: '${PROJECT_DIR}/CHANGELOG.md',
  githubOptions: {},
  ci: true,
  commitMessage:
    'chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}',
  dryRun: false,
  github: true,
  git: true,
  npm: true,
  repositoryUrl: '',
  tagFormat: '${PROJECT_NAME}-v${version}',
  preset: 'angular',
};
