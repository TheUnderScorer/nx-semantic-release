import { config } from 'dotenv';
import { cleanupTestRepo } from '../packages/nx-semantic-release/src/tests/cleanup-test-repo';

config();

async function main() {
  await cleanupTestRepo();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
