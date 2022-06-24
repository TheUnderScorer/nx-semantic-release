import path from 'path';

const ciEnvToRemove = [
  'GITHUB_EVENT_NAME',
  'GITHUB_RUN_ID',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKSPACE',
  'GITHUB_ACTIONS',
];

Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: path.resolve(
    __dirname,
    '../../../../tmp/nx-e2e/proj'
  ),
});

ciEnvToRemove.forEach((key) => {
  delete process.env[key];
});
