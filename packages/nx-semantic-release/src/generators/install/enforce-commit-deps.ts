import {
  addDependenciesToPackageJson,
  readJson,
  Tree,
  updateJson,
} from '@nx/devkit';
import type { PackageJson } from 'type-fest';
import { constants } from 'fs';

export const commitLintPreset = '@commitlint/config-conventional';
export const generatedCommitLintConfigName = '.commitlintrc.json';

export function addCommitEnforceDependencies(tree: Tree) {
  addDevDependencies(tree);
  setupHuskyExecutable(tree);
  setupHuskyConfig(tree);
  addCommitlintConfig(tree);
}

function addDevDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@commitlint/cli': '^17.0.0',
      [commitLintPreset]: '^17.0.0',
      husky: '^8.0.0',
    }
  );
}

function setupHuskyExecutable(tree: Tree) {
  return updateJson(tree, 'package.json', (packageJson: PackageJson) => {
    const huskyExists = tree.exists('.husky/_/husky.sh');

    if (!huskyExists) {
      packageJson.scripts = {
        ...packageJson.scripts,
        ...{ prepare: 'husky install' },
      };
    }

    return packageJson;
  });
}

function setupHuskyConfig(tree: Tree) {
  const hasConfigFile: boolean = tree.exists('.husky/commit-msg');

  if (!hasConfigFile) {
    const commitMsg = `#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpx --no-install commitlint --edit $1\n`;

    tree.write('.husky/commit-msg', commitMsg, {
      mode: constants.S_IRWXU,
    });
  }
}

function addCommitlintConfig(tree: Tree) {
  const possibleConfigs = [
    'commitlint.config.js',
    'commitlint',
    '.commitlintrc.js',
    '.commitlintrc.json',
    '.commitlintrc.yml',
  ];

  const packageJson = readJson(tree, 'package.json');

  const hasConfig =
    packageJson.commitlint != null ||
    possibleConfigs.some((config) => tree.exists(config));

  if (!hasConfig) {
    tree.write(
      generatedCommitLintConfigName,
      JSON.stringify(
        {
          extends: [commitLintPreset],
          rules: {},
        },
        null,
        2
      )
    );
  }

  return tree;
}
