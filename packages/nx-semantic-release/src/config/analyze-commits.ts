import { Commit, Context } from 'semantic-release';
import { PluginFn } from 'semantic-release-plugin-decorators';
import { executorContext } from './executor-context';
import { ExecutorContext } from '@nrwl/devkit';
import { getProjectDependencies } from '../common/project';
import { isCommitAffectingProjects } from '../common/git';
import { promiseFilter } from '../utils/promise-filter';

export const getCommitsForProject =
  (verbose?: boolean) =>
  (plugin: PluginFn) =>
  async (config: unknown, context: Context) => {
    if (!executorContext) {
      throw new Error('Executor context is missing.');
    }

    if (!context.commits) {
      throw new Error('Commits are missing.');
    }

    const filteredCommits = await filterCommits(
      context.commits,
      executorContext,
      context,
      verbose
    );

    return plugin(config, {
      ...context,
      commits: filteredCommits,
    });
  };

const filterCommits = async (
  commits: Commit[],
  executorContext: ExecutorContext,
  context: Context,
  verbose?: boolean
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const deps = await getProjectDependencies(executorContext.projectName!);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const allDeps = [...deps, executorContext.projectName!];

  if (verbose) {
    context.logger.log(
      `Found following dependencies: "${deps.join(', ')}" for project "${
        executorContext.projectName
      }"`
    );
  }

  const result = await promiseFilter(commits, (commit) =>
    isCommitAffectingProjects(
      commit,
      allDeps,
      executorContext,
      context,
      verbose
    )
  );

  if (verbose) {
    context.logger.log(
      `Filtered ${result.length} commits out of ${commits.length}`
    );
  }

  return result;
};
