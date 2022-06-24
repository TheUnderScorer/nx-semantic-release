import { config } from 'dotenv';
import path from 'path';

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: path.resolve(
    __dirname,
    '../../../../tmp/nx-e2e/proj'
  ),
});

const envPath = path.resolve(__dirname, '../../../../.env');

config({
  path: envPath,
});
