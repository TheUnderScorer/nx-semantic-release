import { ExecutorContext, parseTargetString, runExecutor } from '@nrwl/devkit';
import { cosmiconfigSync } from 'cosmiconfig';
import release from 'semantic-release';
import { setExecutorContext } from '../../config';
import { resolvePlugins } from './plugins';
import { getDefaultProjectRoot } from '../../common/project';
import { defaultOptions } from './default-options';
import { ExecutorOptions } from '../../types';
import { unwrapExecutorOptions } from '../../utils/executor';

export type SemanticReleaseOptions = Omit<release.Options, 'extends'> & {
  npm: boolean;
  github: boolean;
  buildTarget?: string;
  changelog?: boolean;
  changelogFile?: string;
  outputPath?: string;
  commitMessage?: string;
  gitAssets?: string[];
  packageJsonDir?: string;
  parserOpts?: Record<string, unknown>;
  writerOpts?: Record<string, unknown>;
  linkCompare?: boolean;
  linkReferences?: boolean;
  releaseRules?: string | { release: string; [key: string]: unknown }[];
};

export async function semanticRelease(
  projectOptions: ExecutorOptions<SemanticReleaseOptions>,
  context: ExecutorContext
) {
  const cosmicOptions: SemanticReleaseOptions =
    cosmiconfigSync('nxrelease').search(context.cwd)?.config ?? {};

  const resolvedOptions = resolveOptions(
    defaultOptions,
    cosmicOptions,
    unwrapExecutorOptions(projectOptions),
    context
  );

  if (resolvedOptions.buildTarget) {
    const params = extractBuildTargetParams(
      resolvedOptions.buildTarget,
      context
    );

    const result = await runExecutor(params, {}, context);

    for await (const output of result) {
      if (!output.success) {
        throw new Error(
          `Failed to run build target ${params.project}:${params.target}`
        );
      }
    }
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

function extractBuildTargetParams(
  buildTarget: string,
  context: ExecutorContext
) {
  if (buildTarget.includes(':')) {
    return parseTargetString(buildTarget);
  }

  return {
    project: context.projectName as string,
    target: buildTarget,
  };
}

export function applyTokens(
  options: SemanticReleaseOptions,
  context: ExecutorContext
) {
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
}

export function resolveOptions(
  defaultOptions: SemanticReleaseOptions,
  cosmicOptions: SemanticReleaseOptions,
  projectOptions: SemanticReleaseOptions,
  context: ExecutorContext
) {
  const mergedOptions = {
    ...defaultOptions,
    ...cosmicOptions,
    ...projectOptions,
  };

  return applyTokens(mergedOptions, context);
}
