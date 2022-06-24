import path from 'path';

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: path.resolve(
    __dirname,
    '../../../../tmp/nx-e2e/proj'
  ),
});
