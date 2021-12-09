import { setupTestRepo } from '../packages/nx-semantic-release/src/tests/setup-test-repo';
import { config } from 'dotenv';

config();

async function main() {
  await setupTestRepo();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
