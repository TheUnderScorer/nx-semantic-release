import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { formatFiles, logger, Tree, installPackagesTask } from '@nrwl/devkit';
import { addCommitEnforceDependencies } from './enforce-commit-deps';
import { createConfigFile } from './create-config-file';

export interface InstallGeneratorOptions
  extends Pick<SemanticReleaseOptions, 'github' | 'repositoryUrl'> {
  baseBranch?: string;
  enforceConventionalCommits?: boolean;
}

export default async function installGenerator(
  tree: Tree,
  options: InstallGeneratorOptions
) {
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
