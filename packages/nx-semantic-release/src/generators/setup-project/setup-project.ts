import { SemanticReleaseOptions } from '../../executors/semantic-release/semantic-release';
import {
  Tree,
  updateProjectConfiguration,
  readProjectConfiguration,
  workspaceRoot,
} from '@nx/devkit';
import { executors } from '../../../builders.json';
import { name } from '../../../package.json';
import { applyTokensToSemanticReleaseOptions } from '../../config/apply-tokens';

export interface SetupProjectGeneratorOptions
  extends Pick<
    SemanticReleaseOptions,
    'github' | 'repositoryUrl' | 'changelog' | 'npm' | 'tagFormat'
  > {
  projectName: string;
}

export async function setupProject(
  tree: Tree,
  { projectName, ...options }: SetupProjectGeneratorOptions
) {
  const executor = Object.keys(executors)[0];
  const projectConfig = readProjectConfiguration(tree, projectName);

  const semanticReleaseConfig = applyTokensToSemanticReleaseOptions(options, {
    projectName,
    projectDir: projectConfig.root,
    workspaceDir: workspaceRoot,
  });

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      'semantic-release': {
        executor: `${name}:${executor}`,
        options: semanticReleaseConfig,
      },
    },
  });
}
