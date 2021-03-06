import { ExecutorContext, parseTargetString, runExecutor } from '@nrwl/devkit';
import { cosmiconfigSync } from 'cosmiconfig';
import release from 'semantic-release';
import { setExecutorContext } from '../../semantic-release-plugin';
import { resolvePlugins } from './plugins';
import { defaultOptions } from './default-options';
import { ExecutorOptions } from '../../types';
import { unwrapExecutorOptions } from '../../utils/executor';
import { applyTokensToSemanticReleaseOptions } from '../../config/apply-tokens';
import { getDefaultProjectRoot } from '../../common/project';

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
  preset?: string;
  presetConfig?: Record<string, unknown>;
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

  const tagFormat = resolvedOptions.tagFormat
    ? parseTag(resolvedOptions.tagFormat)
    : resolvedOptions.tagFormat;

  await release({
    extends: '@theunderscorer/nx-semantic-release',
    ...resolvedOptions,
    tagFormat,
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

  return applyTokensToSemanticReleaseOptions(mergedOptions, {
    projectName: context.projectName as string,
    projectDir: getDefaultProjectRoot(context),
  });
}

// Replace our token that is used for consistency with token required by semantic-release
export function parseTag(tag: string) {
  return tag.replace('${VERSION}', (match) => match.toLowerCase());
}
