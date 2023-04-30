import { writeJsonFile } from '@nx/devkit';
import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { InstallGeneratorOptions } from './install';

export const generatedConfigFileName = '.nxreleaserc.json';

export function createConfigFile(options: InstallGeneratorOptions) {
  const config: SemanticReleaseOptions = {
    changelog: options.changelog,
    npm: true,
    github: options.github,
    repositoryUrl: options.repositoryUrl,
    branches: [options.baseBranch],
  };

  writeJsonFile(generatedConfigFileName, config);
}
