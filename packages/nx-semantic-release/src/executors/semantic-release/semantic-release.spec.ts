import { SemanticReleaseOptions, applyTokens } from './semantic-release';
import { readTestAppWorkspace } from '../../tests/utils';
import { testRepoPath } from '../../tests/constants';
import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';

describe('applyTokens', () => {
  let workspace;
  let mockOptions: SemanticReleaseOptions;
  let mockContext: ExecutorContext;

  beforeAll(() => {
    workspace = readTestAppWorkspace();
    mockOptions = {
      buildTarget: '${PROJECT_NAME}:build',
      changelogFile: '${PROJECT_DIR}/CHANGELOG.md',
      commitMessage: 'release ${PROJECT_NAME} in ${PROJECT_DIR}',
      packageJsonDir: '${PROJECT_DIR}/src',
      tagFormat: '${PROJECT_NAME}-v${version}',
      npm: true,
      github: true,
      git: true,
      changelog: true,
    };
    mockContext = {
      cwd: testRepoPath,
      root: testRepoPath,
      workspace,
      isVerbose: false,
      projectName: 'app-a',
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
