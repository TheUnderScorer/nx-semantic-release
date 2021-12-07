import { testRepoPath } from './constants';
import { config } from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');

config({
  path: envPath,
});

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: testRepoPath,
});
