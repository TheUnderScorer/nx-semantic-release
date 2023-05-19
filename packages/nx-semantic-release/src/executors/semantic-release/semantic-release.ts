import {
  ExecutorContext,
  parseTargetString,
  ProjectGraph,
  runExecutor,
  workspaceRoot,
} from '@nx/devkit';
import { cosmiconfigSync } from 'cosmiconfig';
import type release from 'semantic-release';
import {
  Options as BaseSemanticReleaseOptions,
  PluginSpec,
} from 'semantic-release';
import { setExecutorContext } from '../../semantic-release-plugin';
import { resolvePlugins } from './plugins';
import { defaultOptions } from './default-options';
import { ExecutorOptions } from '../../types';
import { unwrapExecutorOptions } from '../../utils/executor';
import { applyTokensToSemanticReleaseOptions } from '../../config/apply-tokens';
import { getDefaultProjectRoot, GetProjectContext } from '../../common/project';
import { createProjectGraphAsync } from '@nx/devkit';

export type SemanticReleaseOptions = Omit<
  BaseSemanticReleaseOptions,
  'extends'
> & {
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
  releaseRules?:
    | string
    | { release: string | boolean; [key: string]: unknown }[];
  preset?: string;
  presetConfig?: Record<string, unknown>;
  plugins?: PluginSpec[];
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
      context,
      context.projectGraph ?? (await createProjectGraphAsync())
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

  const release = await getSemanticRelease();

  await release({
    extends: '@goestav/nx-semantic-release',
    ...resolvedOptions,
    tagFormat,
    plugins,
  });

  return {
    success: true,
  };
}

/**
 * @FIXME Recently semantic-release became esm only, but until NX will support plugins in ESM, we have to use this dirty hack :/
 * */
function getSemanticRelease() {
  const fn = new Function(
    'return import("semantic-release").then(m => m.default)'
  );

  return fn() as Promise<typeof release>;
}

function extractBuildTargetParams(
  buildTarget: string,
  context: ExecutorContext,
  graph: ProjectGraph
) {
  if (buildTarget.includes(':')) {
    return parseTargetString(buildTarget, graph);
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
  context: GetProjectContext
) {
  const mergedOptions = {
    ...defaultOptions,
    ...cosmicOptions,
    ...projectOptions,
  };

  return applyTokensToSemanticReleaseOptions(mergedOptions, {
    projectName: context.projectName as string,
    projectDir: getDefaultProjectRoot(context),
    workspaceDir: workspaceRoot,
  });
}

// Replace our token that is used for consistency with token required by semantic-release
export function parseTag(tag: string) {
  return tag.replace('${VERSION}', (match) => match.toLowerCase());
}
