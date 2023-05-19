import { readJson, runNxCommandAsync, updateFile } from '@nx/plugin/testing';
import { ProjectConfiguration, TargetConfiguration } from '@nx/devkit';
import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { TestReleasableProject } from '../../tests/types';
import { setupTestRepo } from '../../tests/setup-test-repo';
import { safeRunNxCommandAsync } from '../../tests/utils';
import { getCommitTag, getTestRepoCommits } from '../../tests/git';
import { findReleaseCommit } from '../../tests/find-release-commit';

const project: TestReleasableProject = 'app-a';
const projectConfigurationPath = `apps/${project}/project.json`;

function assertProjectConfiguration(
  config: TargetConfiguration<SemanticReleaseOptions>
) {
  const projectConfiguration = readJson<ProjectConfiguration>(
    projectConfigurationPath
  );

  expect(projectConfiguration.targets?.['semantic-release']).toEqual(config);
}

describe('Setup project', () => {
  beforeEach(async () => {
    await setupTestRepo();
  });

  it('should setup project', async () => {
    await runNxCommandAsync(
      `generate @goestav/nx-semantic-release:setup-project ${project}`
    );

    assertProjectConfiguration({
      executor: '@goestav/nx-semantic-release:semantic-release',
      options: {
        github: true,
        changelog: true,
        npm: true,
        tagFormat: `${project}-v$\{VERSION}`,
      },
    });
  });

  it('should setup project using given configuration', async () => {
    await runNxCommandAsync(
      `generate @goestav/nx-semantic-release:setup-project ${project} --github=false --changelog=false --npm=false --tagFormat=test`
    );

    assertProjectConfiguration({
      executor: '@goestav/nx-semantic-release:semantic-release',
      options: {
        github: false,
        changelog: false,
        npm: false,
        tagFormat: 'test',
      },
    });
  });

  it('should create valid project configuration that can be released', async () => {
    await runNxCommandAsync(
      `generate @goestav/nx-semantic-release:setup-project ${project} --github=false --changelog=true --npm=true`
    );

    updateFile(projectConfigurationPath, (file) => {
      const json = JSON.parse(file) as ProjectConfiguration;

      const updated: ProjectConfiguration = {
        ...json,
        targets: {
          ...json.targets,
          'semantic-release': {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain,@typescript-eslint/no-non-null-assertion
            ...json.targets?.['semantic-release']!,
            options: {
              ...json.targets?.['semantic-release'].options,
              ci: false,
              commitMessage:
                'chore(app-a): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
            } as SemanticReleaseOptions,
          },
        },
      };

      return JSON.stringify(updated, null, 2);
    });

    await safeRunNxCommandAsync(`run ${project}:semantic-release`);

    const commits = getTestRepoCommits();
    const releaseCommit = findReleaseCommit(project, commits);
    expect(releaseCommit).toBeTruthy();

    const tag = await getCommitTag(releaseCommit.hash);
    expect(tag).toEqual(`${project}-v1.0.0`);
  });
});
