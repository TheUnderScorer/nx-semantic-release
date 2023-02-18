import {
  ensureNxProject,
  runPackageManagerInstall,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { PackageJson } from 'type-fest';
import path from 'path';

export function setupTestNxWorkspace() {
  const distPath = path.resolve(
    __dirname,
    '../../../..',
    'dist/packages/nx-semantic-release'
  );

  ensureNxProject('@theunderscorer/nx-semantic-release', distPath);

  updateFile('package.json', (contents) => {
    const pkg = JSON.parse(contents) as PackageJson;

    pkg.devDependencies = {
      ...pkg.devDependencies,
      '@theunderscorer/nx-semantic-release': `file:${distPath}`,
    };

    return JSON.stringify(pkg, null, 2);
  });

  runPackageManagerInstall();
}
