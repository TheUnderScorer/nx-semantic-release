import { defaultOptions } from './default-options';
import {
  SemanticReleaseOptions,
  applyTokens,
  resolveOptions,
} from './semantic-release';
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

describe('resolveOptions', () => {
  const cosmicOptions: SemanticReleaseOptions = {
    ...requiredOptions,
    dryRun: true,
    option1: 'fake1Cosmic',
    option2: 'fake2Cosmic',
  };
  const projectOptions: SemanticReleaseOptions = {
    ...requiredOptions,
    ci: false,
    option1: 'fake1Proj',
    option3: 'fake3Proj',
  };
  const resolvedOptions = resolveOptions(
    defaultOptions,
    cosmicOptions,
    projectOptions,
    mockContext
  );

  it('should return options from defaultOptions', () => {
    expect(cosmicOptions.tagFormat).toBeUndefined();
    expect(projectOptions.tagFormat).toBeUndefined();
    expect(resolvedOptions.tagFormat).toEqual('app-a-v${version}');
  });

  it('should return options from cosmicOptions', () => {
    expect(defaultOptions.option2).toBeUndefined();
    expect(projectOptions.option2).toBeUndefined();
    expect(resolvedOptions.option2).toEqual('fake2Cosmic');

    expect(defaultOptions.dryRun).toEqual(false);
    expect(projectOptions.dryRun).toBeUndefined();
    expect(resolvedOptions.dryRun).toEqual(true);
  });

  it('should return options from projectOptions', () => {
    expect(defaultOptions.ci).toEqual(true);
    expect(cosmicOptions.ci).toBeUndefined();
    expect(resolvedOptions.ci).toEqual(false);

    expect(defaultOptions.option1).toBeUndefined();
    expect(cosmicOptions.option1).toEqual('fake1Cosmic');
    expect(resolvedOptions.option1).toEqual('fake1Proj');

    expect(defaultOptions.option3).toBeUndefined();
    expect(cosmicOptions.option3).toBeUndefined();
    expect(resolvedOptions.option3).toEqual('fake3Proj');
  });
});
