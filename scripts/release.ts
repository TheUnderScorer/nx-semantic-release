import { logger } from '@nx/devkit';
import { exec } from '../packages/nx-semantic-release/src/utils/exec';
import { config } from 'dotenv';

config();

async function main() {
  logger.log('Starting package release...');

  await exec('pnpm build:skip-cache', {
    verbose: true,
  });

  await exec('pnpm link dist/packages/nx-semantic-release');
  await exec('pnpm install');

  await exec('nx run nx-semantic-release:semantic-release --verbose', {
    verbose: true,
  });

  logger.log('Package released!');
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
