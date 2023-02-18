import path from 'path';

// Note: we cannot use tmpProjPath() here, because it uses the NX_WORKSPACE_ROOT_PATH, so it will cause infinite loop
const root = path.resolve(__dirname, '../../tmp/nx-e2e/proj');

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: root,
});
