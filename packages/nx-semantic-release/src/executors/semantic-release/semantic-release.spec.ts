import { SemanticReleaseOptions, applyTokens } from './semantic-release';
import { readTestAppWorkspace } from '../../tests/utils';
import { testRepoPath } from '../../tests/constants';
import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';

const requiredOptions: SemanticReleaseOptions = {
  changelog: true,
  changelogFile: '',
  commitMessage: '',
  git: true,
  github: true,
  npm: true,
};

const mockContext: ExecutorContext = {
  cwd: testRepoPath,
  root: testRepoPath,
  workspace: readTestAppWorkspace(),
  isVerbose: false,
  projectName: 'app-a',
};

describe('applyTokens', () => {
  let mockOptions: SemanticReleaseOptions;

  beforeAll(() => {
    mockOptions = {
      ...requiredOptions,
      buildTarget: '${PROJECT_NAME}:build',
      changelogFile: '${PROJECT_DIR}/CHANGELOG.md',
      commitMessage: 'release ${PROJECT_NAME} in ${PROJECT_DIR}',
      packageJsonDir: '${PROJECT_DIR}/src',
      tagFormat: '${PROJECT_NAME}-v${version}',
    };
  });

  it('should return options with ${PROJECT_DIR} tokens replaced', () => {
    const results = applyTokens(mockOptions, mockContext);

    expect(results.changelogFile).toEqual(
      `${path.join(testRepoPath, 'apps/app-a')}/CHANGELOG.md`
    );
    expect(results.packageJsonDir).toEqual(
      `${path.join(testRepoPath, 'apps/app-a')}/src`
    );
  });

  it('should return options with ${PROJECT_NAME} tokens replaced', () => {
    const results = applyTokens(mockOptions, mockContext);

    expect(results.buildTarget).toEqual('app-a:build');
    expect(results.tagFormat).toEqual('app-a-v${version}');
  });

  it('should return options with multiple tokens replaced', () => {
    const results = applyTokens(mockOptions, mockContext);

    expect(results.commitMessage).toEqual(
      `release app-a in ${path.join(testRepoPath, 'apps/app-a')}`
    );
  });
});
