import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { formatFiles, logger, Tree, installPackagesTask } from '@nx/devkit';
import { addCommitEnforceDependencies } from './enforce-commit-deps';
import { createConfigFile } from './create-config-file';

export interface InstallGeneratorOptions
  extends Pick<
    SemanticReleaseOptions,
    'github' | 'repositoryUrl' | 'changelog'
  > {
  baseBranch?: string;
  enforceConventionalCommits?: boolean;
}

export async function install(tree: Tree, options: InstallGeneratorOptions) {
  if (options.enforceConventionalCommits) {
    await addCommitEnforceDependencies(tree);
  }

  createConfigFile(options);

  await formatFiles(tree);

  if (options.enforceConventionalCommits) {
    logger.log('Installing dependencies...');

    installPackagesTask(tree);
  }
}
