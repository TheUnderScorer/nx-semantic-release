import path from 'path';
import { getProject, getProjectDependencies, getProjectRoot } from './project';
import { readTestAppWorkspace } from '../tests/utils';
import { testRepoPath } from '../tests/constants';

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

    const result = getProjectRoot(workspace.projects['app-a'], testRepoPath);

    expect(result).toEqual(path.join(testRepoPath, '/apps/app-a'));
  });
});

describe('getProject', () => {
  it('should return project from workspace', () => {
    const workspace = readTestAppWorkspace();

    expect(
      getProject({
        cwd: testRepoPath,
        workspace,
        projectName: 'app-a',
      })
    ).toEqual(workspace.projects['app-a']);
  });
});
