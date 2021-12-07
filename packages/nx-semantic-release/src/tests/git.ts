import gitlog from 'gitlog';
import { testRepoPath } from './constants';
import { TestRepoCommit } from './types';
import { exec } from '../utils/exec';

export const getTestRepoCommits = (): TestRepoCommit[] =>
  gitlog({
    repo: testRepoPath,
    fields: ['hash', 'subject', 'abbrevHash'],
  });

export const getCommitTag = (commitId: string) =>
  exec(`git describe --tags ${commitId}`);
