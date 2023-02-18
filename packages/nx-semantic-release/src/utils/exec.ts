import cp from 'child_process';

export interface ExecOptions extends cp.ExecOptions {
  verbose?: boolean;
}

export class ExecError extends Error {
  constructor(message: string, public stdout: string, public stderr: string) {
    const fullMessage = [message, stdout, stderr].filter(Boolean).join('\n');

    super(fullMessage);
  }
}

export const exec = (
  command: string,
  { verbose = false, ...rest }: ExecOptions = {}
) =>
  new Promise<string>((resolve, reject) => {
    const result = cp.exec(
      command,
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
      result.stdout?.pipe(process.stdout);
      result.stderr?.pipe(process.stderr);
      result.stdin?.pipe(process.stdin);
    }
  });
