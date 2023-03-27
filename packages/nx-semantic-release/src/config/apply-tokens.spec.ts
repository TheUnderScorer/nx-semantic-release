import { SemanticReleaseOptions } from '../executors/semantic-release/semantic-release';
import {
  applyTokensToSemanticReleaseOptions,
  ConfigTokensDict,
} from './apply-tokens';

const requiredOptions: SemanticReleaseOptions = {
  changelog: true,
  changelogFile: '',
  commitMessage: '',
  github: true,
  npm: true,
};

const mockTokens: ConfigTokensDict = {
  projectDir: 'apps/app-a',
  projectName: 'app-a',
  workspaceDir: '.',
};

describe('applyTokensToSemanticReleaseOptions', () => {
  let mockOptions: SemanticReleaseOptions;

  beforeAll(() => {
    mockOptions = {
      ...requiredOptions,
      buildTarget: '${PROJECT_NAME}:build',
      changelogFile: '${PROJECT_DIR}/CHANGELOG.md',
      commitMessage: 'release ${PROJECT_NAME} in ${PROJECT_DIR}',
      packageJsonDir: '${PROJECT_DIR}/src',
      tagFormat: '${PROJECT_NAME}-v${version}',
      outputPath: '${WORKSPACE_DIR}/dist/apps/${PROJECT_NAME}',
      plugins: [
        '@fake/plugin-without-options1', 
        [
          '@semantic-release/exec',
          {
            prepareCmd: 'cp LICENSE dist/packages/${PROJECT_NAME} && cp README.md dist/packages/${PROJECT_NAME}',
            execCwd: '${WORKSPACE_DIR}',
            fakeStringArrayOption: ['${WORKSPACE_DIR}/src', '${WORKSPACE_DIR}/dist'],
            fakeBooleanOption: true,
            fakeNumberOption: 10
          }
        ],
        '@fake/plugin-without-options2', 
    ]
    };
  });

  it('should return options with ${PROJECT_DIR} tokens replaced', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.changelogFile).toEqual(`apps/app-a/CHANGELOG.md`);
    expect(results.packageJsonDir).toEqual(`apps/app-a/src`);
  });

  it('should return options with ${PROJECT_NAME} tokens replaced', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.buildTarget).toEqual('app-a:build');
    expect(results.tagFormat).toEqual('app-a-v${version}');
  });

  it('should return options with ${WORKSPACE_DIR} tokens replaced', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.outputPath).toEqual(`./dist/apps/app-a`);
  });

  it('should return options with multiple tokens replaced', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.commitMessage).toEqual(`release app-a in apps/app-a`);
    expect(results.outputPath).toEqual(`./dist/apps/app-a`);
  });


  it('should replace tokens in plugins options of type string or string[]', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.plugins).toEqual([
      '@fake/plugin-without-options1', 
      [
        '@semantic-release/exec',
        {
          prepareCmd: 'cp LICENSE dist/packages/app-a && cp README.md dist/packages/app-a',
          execCwd: '.',
          fakeStringArrayOption: ['./src', './dist'],
          fakeBooleanOption: true,
          fakeNumberOption: 10
        }
      ],
      '@fake/plugin-without-options2', 
  ]);
  });
});
