import path from 'path';
import fs from 'fs';

// Note: we cannot use tmpProjPath() here, because it uses the NX_WORKSPACE_ROOT_PATH, so it will cause infinite loop
const possibleRoots = [
  path.resolve(__dirname, '../../tmp/nx-e2e/proj'),
  path.resolve(__dirname, '../../../tmp/nx-e2e/proj'),
  path.resolve(__dirname, '../../../../tmp/nx-e2e/proj'),
];

let hasRoot = false;

for (const possibleRoot of possibleRoots) {
  if (fs.existsSync(possibleRoot)) {
    console.info(`Found test project root at ${possibleRoot}`);

    Object.assign(process.env, {
      NX_WORKSPACE_ROOT_PATH: possibleRoot,
    });

    hasRoot = true;
  }
}

if (!hasRoot) {
  console.error('Failed to find Nx workspace root');

  process.exit(1);
}
