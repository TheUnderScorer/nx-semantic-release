import { testReleasableProjects } from './constants';

export interface TestRepoCommit {
  hash: string;
  subject: string;
  abbrevHash: string;
}

export type TestReleasableProject = typeof testReleasableProjects[number];
