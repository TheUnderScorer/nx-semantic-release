import { logger } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { remoteGitPath } from '../packages/nx-semantic-release/src/tests/constants';

const configDistPath = path.resolve(
  __dirname,
  '../test-repos/app/nxrelease.config.dist.js'
);
const configPath = path.resolve(
  __dirname,
  '../test-repos/app/nxrelease.config.js'
);
const config = require(configDistPath);

const repositoryUrl = `file://${path.resolve(remoteGitPath)}`;

config.repositoryUrl = repositoryUrl;

logger.info(`Remote repository url: ${repositoryUrl}`);

fs.writeFileSync(
  configPath,
  `module.exports = ${JSON.stringify(config, null, 2)}`
);

logger.info(`Test workspace is ready 😎`);
