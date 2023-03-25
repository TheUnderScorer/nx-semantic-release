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
      outputPath: '${PROJECT_DIR}/../../dist/apps/${PROJECT_NAME}'
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

  it('should return options with multiple tokens replaced', () => {
    const results = applyTokensToSemanticReleaseOptions(
      mockOptions,
      mockTokens
    );

    expect(results.commitMessage).toEqual(`release app-a in apps/app-a`);
    expect(results.outputPath).toEqual(`apps/app-a/../../dist/apps/app-a`);
  });
});
