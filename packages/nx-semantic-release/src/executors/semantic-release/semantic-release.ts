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
};

export async function semanticRelease(
  options: SemanticReleaseOptions,
  context: ExecutorContext
) {
  const resolvedOptions = resolveOptions(options, context);

  if (resolvedOptions.buildTarget) {
    await exec(`npx nx run ${options.buildTarget}`, {
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

const resolveOptions = (
  options: SemanticReleaseOptions,
  context: ExecutorContext
) => {
  const root = getDefaultProjectRoot(context);

  return {
    ...options,
    changelogFile: options.changelogFile?.replace('${PROJECT_DIR}', root),
    tagFormat: options.tagFormat ?? `${context.projectName}-v\${version}`,
  };
};
