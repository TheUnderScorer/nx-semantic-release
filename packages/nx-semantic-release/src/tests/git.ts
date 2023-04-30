import gitlog from 'gitlog';
import { TestRepoCommit } from './types';
import { exec } from '../utils/exec';
import { tmpProjPath } from '@nx/plugin/testing';

export const getTestRepoCommits = (): TestRepoCommit[] =>
  gitlog({
    repo: tmpProjPath(),
    fields: ['hash', 'subject', 'abbrevHash'],
  });

export const getCommitTag = (commitId: string) =>
  exec(`git describe --tags ${commitId}`, {
    cwd: tmpProjPath(),
  });
