import cp from 'child_process';

export interface ExecOptions extends cp.ExecOptions {
  verbose?: boolean;
  sudoInCi?: boolean;
}

export class ExecError extends Error {
  constructor(message: string, public stdout: string, public stderr: string) {
    super(message);
  }
}

// "Hacky" check if we are in CI mode, because process.env.CI might not be set
const isCi = () =>
  process.env.CI ||
  process.env.PATH?.toString().startsWith('/home/runner/work');

const wrapCommand = (command: string) => {
  if (!isCi() || command.startsWith('sudo')) {
    return command;
  }

  return `sudo ${command}`;
};

export const exec = (
  command: string,
  { verbose = false, sudoInCi, ...rest }: ExecOptions = {}
) =>
  new Promise((resolve, reject) => {
    const wrappedCommand = sudoInCi ? wrapCommand(command) : command;

    const result = cp.exec(
      wrappedCommand,
      {
        env: process.env,
        ...rest,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new ExecError(error.message, stdout, stderr));
        }

        resolve(stdout.trim().concat(stderr.trim()));
      }
    );

    if (verbose) {
      result.stdout.pipe(process.stdout);
      result.stderr.pipe(process.stderr);
      result.stdin.pipe(process.stdin);
    }
  });
