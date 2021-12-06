import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { ExecutorContext, ProjectGraph } from '@nrwl/devkit';
import { filter, map, pipe } from 'remeda';
import { ProjectConfiguration } from '@nrwl/tao/src/shared/workspace';
import path from 'path';

type GetProjectContext = Pick<
  ExecutorContext,
  'workspace' | 'projectName' | 'cwd'
>;

export const getProjectDependencies = async (projectName: string) => {
  const graph = await createProjectGraphAsync();

  return getRecursiveDependencies(projectName, graph);
};

export const getProject = (context: GetProjectContext) =>
  context.workspace.projects[context.projectName];

export const getProjectRoot = (project: ProjectConfiguration, cwd: string) =>
  path.join(cwd, project.root);

export const getDefaultProjectRoot = (context: GetProjectContext) =>
  getProjectRoot(getProject(context), context.cwd);

const getRecursiveDependencies = (projectName: string, graph: ProjectGraph) => {
  const deps = graph.dependencies[projectName];

  if (!deps) {
    return [];
  }

  return pipe(
    deps,
    filter((dependency) => !dependency.target.startsWith('npm:')),
    map((dependency) => dependency.target),
    (filteredDeps) =>
      filteredDeps.reduce((acc, target) => {
        const targetDeps = getRecursiveDependencies(target, graph);

        return [...acc, ...targetDeps];
      }, filteredDeps)
  );
};
