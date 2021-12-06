import { Commit, Context } from 'semantic-release';
import { ExecutorContext } from '@nrwl/devkit';
import { exec } from '../utils/exec';

export const isCommitAffectingProjects = async (
  commit: Pick<Commit, 'subject' | 'commit'>,
  projects: string[],
  executorContext: Pick<ExecutorContext, 'workspace'>,
  context: Pick<Context, 'logger'>,
  verbose?: boolean
) => {
  const affectedFiles = await listAffectedFilesInCommit(commit);

  if (verbose) {
    context.logger.log(
      `Checking if commit ${commit.subject} affects dependencies`
    );
  }

  const result = affectedFiles.some((file) =>
    projects.find((project) => {
      const projectPath = executorContext.workspace.projects[project].root;

      return file.includes(projectPath);
    })
  );

  if (verbose) {
    if (result) {
      context.logger.log(
        `✔  Commit "${commit.subject}" affects project or its dependencies`
      );
    } else {
      context.logger.log(
        `❌  Commit "${commit.subject}" does not affect project or its dependencies`
      );
    }
  }

  return result;
};

const listAffectedFilesInCommit = async (commit: Pick<Commit, 'commit'>) => {
  const files = await exec(`git show --name-status ${commit.commit.short}`);

  return files
    .toString()
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t')[1])
    .filter(Boolean);
};
