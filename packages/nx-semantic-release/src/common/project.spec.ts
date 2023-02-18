import path from 'path';
import { getProject, getProjectDependencies, getProjectRoot } from './project';
import { readTestAppWorkspace } from '../tests/utils';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';
import { setupTestRepo } from '../tests/setup-test-repo';
import { cleanupTestRepo } from '../tests/cleanup-test-repo';

beforeAll(async () => {
  cleanupTestRepo();

  await setupTestRepo();
});

afterAll(async () => {
  cleanupTestRepo();
});

describe('getProjectDependencies', () => {
  it.each<{ projectName: string; expectedDependencies: string[] }>([
    {
      projectName: 'app-a',
      expectedDependencies: ['lib-a', 'lib-a-dependency', 'common-lib'],
    },
    {
      projectName: 'app-b',
      expectedDependencies: ['common-lib'],
    },
    {
      projectName: 'common-lib',
      expectedDependencies: [],
    },
  ])('should return correct dependencies', async (data) => {
    const result = await getProjectDependencies(data.projectName);

    expect(result.dependencies).toEqual(data.expectedDependencies);
  });
});

describe('getProjectRoot', () => {
  it('should return correct project root', () => {
    const workspace = readTestAppWorkspace();

    const result = getProjectRoot(workspace.projects['app-a'], tmpProjPath());

    expect(result).toEqual(path.join(tmpProjPath(), '/apps/app-a'));
  });
});

describe('getProject', () => {
  it('should return project from workspace', () => {
    const projectsConfigurations = readTestAppWorkspace();

    expect(
      getProject({
        cwd: tmpProjPath(),
        projectsConfigurations,
        projectName: 'app-a',
      })
    ).toEqual(projectsConfigurations.projects['app-a']);
  });
});
