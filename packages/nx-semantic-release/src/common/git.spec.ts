/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isCommitAffectingProjects } from './git';
import { readTestAppWorkspace } from '../tests/utils';
import { createFakeSemanticReleaseLogger } from '../tests/logger';
import { testRepoPath } from '../tests/constants';
import { setupTestRepo, SetupTestRepoResult } from '../tests/setup-test-repo';
import { cleanupTestRepo } from '../tests/cleanup-test-repo';

describe('isCommitAffectingProjects', () => {
  let commits: SetupTestRepoResult['commits'];

  beforeEach(async () => {
    const result = await setupTestRepo();

    commits = result.commits;

    process.chdir(testRepoPath);
  });

  afterAll(async () => {
    await cleanupTestRepo();
  });

  it('should return true if the commit is affecting the project', async () => {
    const cases: {
      projects: string[];
      commitHash: string;
      expected: boolean;
    }[] = [
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-a libs'
        )!.abbrevHash,
        projects: ['lib-a'],
        expected: true,
      },
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-a libs'
        )!.abbrevHash,
        projects: ['app-a'],
        expected: false,
      },
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-a libs'
        )!.abbrevHash,
        projects: ['lib-a'],
        expected: true,
      },
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-b'
        )!.abbrevHash,
        projects: ['app-a'],
        expected: false,
      },
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-b'
        )!.abbrevHash,
        projects: ['app-b'],
        expected: true,
      },
      {
        commitHash: commits.find(
          (commit) => commit.subject === 'feat: add app-b'
        )!.abbrevHash,
        projects: ['app-b'],
        expected: true,
      },
    ];

    for (const data of cases) {
      const result = await isCommitAffectingProjects(
        {
          subject: '',
          commit: {
            short: data.commitHash,
            long: '',
          },
        },
        data.projects,
        {
          workspace: readTestAppWorkspace(),
        },
        {
          logger: createFakeSemanticReleaseLogger(),
        }
      );

      expect(result).toEqual(data.expected);
    }
  });
});
