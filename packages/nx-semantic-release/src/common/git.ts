import type { Commit, Context } from 'semantic-release';
import { ProjectGraph } from '@nrwl/devkit';
import { exec } from '../utils/exec';
import { calculateFileChanges } from '@nrwl/workspace/src/core/file-utils';
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
  const filteredGraph = filterAffected(graph, fileChanges);

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

  const skipMatches = [`[skip ${projectName}]`, '[skip all]'];
  const onlyMatches = Array.from(commit.body.matchAll(onlyMatchRegex));

  const hasOnlyMatch =
    onlyMatches.length &&
    !onlyMatches.some((match) => match[1] === projectName);

  const hasSkipMatch = skipMatches.some((skipMatch) =>
    commit.body.includes(skipMatch)
  );

  return Boolean(hasSkipMatch || hasOnlyMatch);
}

async function listAffectedFilesInCommit(
  commit: Pick<Commit, 'commit'>
): Promise<string[]> {
  const files = await exec(`git show --name-status ${commit.commit.short}`);

  return files
    .toString()
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t')[1])
    .filter(Boolean);
}
