import { logger } from '@nrwl/devkit';
import { exec } from '../packages/nx-semantic-release/src/utils/exec';
import { config } from 'dotenv';

config();

async function main() {
  logger.log('Starting package release...');

  await exec('npm run build:skip-cache', {
    verbose: true,
  });

  await exec('npm link dist/packages/nx-semantic-release');

  await exec('nx run nx-semantic-release:semantic-release', {
    verbose: true,
  });

  logger.log('Package released!');
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
