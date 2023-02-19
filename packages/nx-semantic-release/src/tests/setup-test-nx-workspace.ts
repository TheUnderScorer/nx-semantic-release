import {
  ensureNxProject,
  tmpProjPath,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { PackageJson } from 'type-fest';
import path from 'path';
import { runCommandsInTestProj } from './setup-test-repo';
import fs from 'fs-extra';

export async function setupTestNxWorkspace() {
  try {
    console.info('Setting up at test nx workspace at:', tmpProjPath());

    const distPath = path.resolve(
      __dirname,
      '../../../..',
      'dist/packages/nx-semantic-release'
    );

    if (!fs.existsSync(distPath)) {
      throw new Error(`Nx plugin dist folder does not exist at: ${distPath}`);
    }

    ensureNxProject('@theunderscorer/nx-semantic-release', distPath);

    updateFile('package.json', (contents) => {
      const pkg = JSON.parse(contents) as PackageJson;

      pkg.devDependencies = {
        ...pkg.devDependencies,
        '@theunderscorer/nx-semantic-release': `file:${distPath}`,
      };

      return JSON.stringify(pkg, null, 2);
    });

    await runCommandsInTestProj(['npm install']);
  } catch (error) {
    console.error('Failed to setup test Nx workspace', error);

    throw error;
  }
}
