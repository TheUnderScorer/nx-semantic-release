import {
  ensureNxProject,
  getCwd,
  runPackageManagerInstall,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { PackageJson } from 'type-fest';
import path from 'path';

export function setupTestNxWorkspace() {
  ensureNxProject(
    '@theunderscorer/nx-semantic-release',
    'dist/packages/nx-semantic-release'
  );

  updateFile('package.json', (contents) => {
    const pkg = JSON.parse(contents) as PackageJson;

    pkg.devDependencies = {
      ...pkg.devDependencies,
      '@theunderscorer/nx-semantic-release': `file:${path.resolve(
        getCwd(),
        'dist/packages/nx-semantic-release'
      )}`,
    };

    return JSON.stringify(pkg, null, 2);
  });

  runPackageManagerInstall();
}
