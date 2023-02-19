import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import {
  ExecutorContext,
  ProjectConfiguration,
  ProjectGraph,
} from '@nrwl/devkit';
import { filter, map, pipe } from 'remeda';
import path from 'path';

export type GetProjectContext = Pick<
  ExecutorContext,
  'projectName' | 'cwd' | 'projectsConfigurations' | 'projectGraph'
>;

export const getProjectDependencies = async (projectName: string) => {
  const graph = await createProjectGraphAsync();

  return {
    dependencies: getRecursiveDependencies(projectName, graph),
    graph,
  };
};

export const getProject = (context: GetProjectContext) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return context.projectsConfigurations!.projects[context.projectName!];
};

export const getProjectRoot = (
  project: ProjectConfiguration | string,
  cwd: string
) => path.join(cwd, typeof project === 'string' ? project : project.root);

export const getDefaultProjectRoot = (context: GetProjectContext) =>
  getProjectRoot(getProject(context), context.cwd);

export const getRecursiveDependencies = (
  projectName: string,
  graph: ProjectGraph
): string[] => {
  const deps = graph.dependencies[projectName];

  if (!deps) {
    return [];
  }

  return pipe(
    deps,
    filter((dependency) => !dependency.target.startsWith('npm:')),
    map((dependency) => dependency.target),
    (filteredDeps: string[]) =>
      filteredDeps.reduce((acc, target) => {
        const targetDeps = getRecursiveDependencies(target, graph);

        return [...acc, ...targetDeps];
      }, filteredDeps)
  );
};
