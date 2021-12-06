import cp from 'child_process';

export const exec = (command: string) =>
  new Promise((resolve, reject) =>
    cp.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve(stdout.trim().concat(stderr.trim()));
    })
  );
