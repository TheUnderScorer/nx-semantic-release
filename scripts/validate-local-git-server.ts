import {
  exec,
  ExecError,
} from '../packages/nx-semantic-release/src/utils/exec';

const expectedMessage = 'Welcome to git-server-docker';

async function main() {
  try {
    const result = await exec('ssh -tt git@localhost -p 2222');

    if (!result.toString().includes(expectedMessage)) {
      console.error(result);

      process.exit(1);
    }
  } catch (error) {
    if (error instanceof ExecError && error.stdout.includes(expectedMessage)) {
      return;
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
