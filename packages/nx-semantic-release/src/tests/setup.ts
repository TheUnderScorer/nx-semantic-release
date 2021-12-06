import { testRepoPath } from './constants';

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: testRepoPath,
});
