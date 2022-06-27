import { TestReleasableProject, TestRepoCommit } from './types';

export function findReleaseCommit(
  app: TestReleasableProject,
  commits: TestRepoCommit[]
) {
  const match = [`chore(${app})`, 'release'];

  const result = commits.find((commit) =>
    match.every((part) => commit.subject.includes(part))
  );

  if (!result) {
    throw new Error(`Could not find release commit for ${app}`);
  }

  return result;
}
