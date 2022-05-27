const path = require('path');
const gitDir = path.resolve(__dirname, '../../git-server/repos/project.git');

module.exports = {
  dryRun: false,
  repositoryUrl: `file://${gitDir}`,
  github: false,
  ci: false,
  branches: ['*'],
};
