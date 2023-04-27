import { defaultOptions } from './default-options';
import {
  parseTag,
  resolveOptions,
  SemanticReleaseOptions,
} from './semantic-release';
import { tmpProjPath } from '@nx/plugin/testing';
import { setupTestRepo } from '../../tests/setup-test-repo';
import { GetProjectContext } from '../../common/project';

describe('parseTag', () => {
  it('should return correct tag', () => {
    const result = parseTag('${PROJECT_NAME}-v${VERSION}');

    expect(result).toEqual('${PROJECT_NAME}-v${version}');
  });
});

describe('resolveOptions', () => {
  const requiredOptions: SemanticReleaseOptions = {
    changelog: true,
    changelogFile: '',
    commitMessage: '',
    github: true,
    npm: true,
    git: true,
  };

  let mockContext: GetProjectContext;

  beforeAll(async () => {
    await setupTestRepo();

    const projPath = tmpProjPath();

    mockContext = {
      cwd: projPath,
      projectName: 'app-a',
      projectsConfigurations: {
        version: 1,
        projects: {
          'app-a': {
            root: 'root',
          },
        },
      },
    };
  });

  let cosmicOptions: SemanticReleaseOptions;

  let projectOptions: SemanticReleaseOptions;

  let resolvedOptions: SemanticReleaseOptions;

  beforeAll(() => {
    cosmicOptions = {
      ...requiredOptions,
      dryRun: true,
      option1: 'fake1Cosmic',
      option2: 'fake2Cosmic',
    };

    projectOptions = {
      ...requiredOptions,
      ci: false,
      option1: 'fake1Proj',
      option3: 'fake3Proj',
    };

    resolvedOptions = resolveOptions(
      defaultOptions,
      cosmicOptions,
      projectOptions,
      mockContext
    );
  });

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
