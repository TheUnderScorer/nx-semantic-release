import { writeJsonFile } from '@nrwl/devkit';
import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import { InstallGeneratorOptions } from './generator';

export const generatedConfigFileName = '.nxrelease.json';

export function createConfigFile(options: InstallGeneratorOptions) {
  const config: SemanticReleaseOptions = {
    changelog: false,
    npm: true,
    github: options.github,
    releaseRules: options.repositoryUrl,
    branches: [options.baseBranch],
  };

  writeJsonFile(generatedConfigFileName, config);
}
