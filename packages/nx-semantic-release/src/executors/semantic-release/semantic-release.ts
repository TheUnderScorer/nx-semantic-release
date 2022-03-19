import { ExecutorContext } from '@nrwl/devkit';
import release from 'semantic-release';
import { setExecutorContext } from '../../config';
import { resolvePlugins } from './plugins';
import { getDefaultProjectRoot } from '../../common/project';
import { exec } from '../../utils/exec';

export type SemanticReleaseOptions = Omit<release.Options, 'extends'> & {
  npm: boolean;
  github: boolean;
  buildTarget?: string;
  changelog: boolean;
  git: boolean;
  changelogFile: string;
  outputPath?: string;
  commitMessage: string;
  gitAssets?: string[];
  packageJsonDir?: string;
  parserOpts?: Record<string, unknown>;
  writerOpts?: Record<string, unknown>;
};

export async function semanticRelease(
  options: SemanticReleaseOptions,
  context: ExecutorContext
) {
  const resolvedOptions = resolveOptions(options, context);

  if (resolvedOptions.buildTarget) {
    await exec(`npx nx run ${resolvedOptions.buildTarget}`, {
      verbose: true,
    });
  }

  setExecutorContext(context);

  const plugins = resolvePlugins(resolvedOptions, context);

  await release({
    extends: '@theunderscorer/nx-semantic-release',
    ...resolvedOptions,
    plugins,
  });

  return {
    success: true,
  };
}

export const applyTokens = (
  options: SemanticReleaseOptions,
  context: ExecutorContext
) => {
  const PROJECT_DIR = getDefaultProjectRoot(context);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const PROJECT_NAME = context.projectName!;

  const replaceTokens = (value: string): string => {
    return value
      .replace('${PROJECT_DIR}', PROJECT_DIR)
      .replace('${PROJECT_NAME}', PROJECT_NAME);
  };

  [
    'buildTarget',
    'changelogFile',
    'commitMessage',
    'packageJsonDir',
    'tagFormat',
  ].forEach((option) => {
    if (options[option]) options[option] = replaceTokens(options[option]);
  });

  if (options.gitAssets?.length)
    options.gitAssets = options.gitAssets.map((asset) => replaceTokens(asset));

  return options;
};

const resolveOptions = (
  options: SemanticReleaseOptions,
  context: ExecutorContext
) => {
  return applyTokens(
    {
      ...options,
    },
    context
  );
};
