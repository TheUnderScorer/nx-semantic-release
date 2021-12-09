import { testProjects } from './constants';

export interface TestRepoCommit {
  hash: string;
  subject: string;
  abbrevHash: string;
}

export type TestApp = typeof testProjects[number];
