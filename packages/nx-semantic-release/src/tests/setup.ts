import path from 'path';

// We need to remove certain env values that are set by CI, they are interfering with semantic-release
const ciEnvToRemove = [
  'GITHUB_EVENT_NAME',
  'GITHUB_RUN_ID',
  'GITHUB_REPOSITORY',
  'GITHUB_WORKSPACE',
  'GITHUB_ACTIONS',
  'GITHUB_EVENT_PATH',
  'GITHUB_SHA',
];

// Note: we cannot use tmpProjPath() here, because it uses the NX_WORKSPACE_ROOT_PATH, so it will cause infinite loop
Object.assign(process.env, {
  NX_WORKSPACE_ROOT_PATH: path.resolve(
    __dirname,
    '../../../../tmp/nx-e2e/proj'
  ),
});

ciEnvToRemove.forEach((key) => {
  delete process.env[key];
});
