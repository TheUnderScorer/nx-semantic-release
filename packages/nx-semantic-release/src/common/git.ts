import type { Commit, Context } from 'semantic-release';
import process from 'process';
import { ProjectGraph } from '@nx/devkit';
import { exec } from '../utils/exec';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph';

interface CommitAffectingProjectsParams {
  commit: Pick<Commit, 'subject' | 'commit' | 'body'>;
  projects: string[];
  // Name of root project
  projectName: string;
  context: Pick<Context, 'logger'>;
  verbose?: boolean;
  graph: ProjectGraph;
}

export async function isCommitAffectingProjects({
  commit,
  projects,
  context,
  verbose,
  graph,
  projectName,
}: CommitAffectingProjectsParams): Promise<boolean> {
  if (shouldSkipCommit(commit, projectName)) {
    if (verbose) {
      context.logger.log(`ℹ️ Commit ${commit.subject} is skipped`);
    }

    return false;
  }

  const affectedFiles = await listAffectedFilesInCommit(commit);
  const fileChanges = calculateFileChanges(affectedFiles, [], { projects });
  const filteredGraph = await filterAffected(graph, fileChanges);

  const isAffected = projects.some((project) =>
    Boolean(filteredGraph.nodes[project])
  );

  if (verbose) {
    context.logger.log(
      `Checking if commit ${commit.subject} affects dependencies`
    );
  }

  if (verbose) {
    if (isAffected) {
      context.logger.log(
        `✔  Commit "${commit.subject}" affects project or its dependencies`
      );
    } else {
      context.logger.log(
        `❌  Commit "${commit.subject}" does not affect project or its dependencies`
      );
    }
  }

  return isAffected;
}

export function shouldSkipCommit(
  commit: Pick<Commit, 'body'>,
  projectName: string
): boolean {
  const onlyMatchRegex = /\[only (.*?)]/g;
  const skipMatchRegex = /\[skip (.*?)]/g;

  const skipAll = '[skip all]';
  const skipMatches = Array.from(commit.body.matchAll(skipMatchRegex));
  const onlyMatches = Array.from(commit.body.matchAll(onlyMatchRegex));

  const hasOnlyMatch =
    onlyMatches.length &&
    !onlyMatches.some((match) =>
      match[1]
        .split(',')
        .map((project) => project.trim())
        .some((project) => project === projectName)
    );

  const hasSkipMatch =
    commit.body.includes(skipAll) ||
    (skipMatches.length &&
      skipMatches.some((match) =>
        match[1]
          .split(',')
          .map((project) => project.trim())
          .some((project) => project === projectName)
      ));

  return Boolean(hasSkipMatch || hasOnlyMatch);
}

async function listAffectedFilesInCommit(
  commit: Pick<Commit, 'commit'>
): Promise<string[]> {
  // eg. /code/Repo/frontend/
  const cwd = process.cwd() + '/';
  // eg. /code/Repo/
  const repositoryRoot = (await exec('git rev-parse --show-toplevel')) + '/';
  // Matches the start of a path from the git root to the nx root
  const nxPathPart = new RegExp(`^${cwd.substring(repositoryRoot.length)}`);

  const files = await exec(`git show --name-status ${commit.commit.short}`);

  return files
    .toString()
    .split('\n')
    .map((line) => line?.split('\t')?.[1])
    .filter(Boolean)
    .filter((filePath: string) => {
      // only include files inside the nx root
      return filePath.match(nxPathPart);
    })
    .map((filePath: string) => {
      // The filepaths start from the root of the git repository, but
      // in our case we want them to start from the nx root.
      return filePath.replace(nxPathPart, '');
    });
}
