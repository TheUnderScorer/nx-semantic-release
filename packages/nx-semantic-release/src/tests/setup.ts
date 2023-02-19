import { tmpProjPath } from '@nrwl/nx-plugin/testing';

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: tmpProjPath(),
});
