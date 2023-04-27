import {
  ExecutorContext,
  ProjectConfiguration,
  ProjectGraph,
} from '@nx/devkit';
import { filter, map, pipe } from 'remeda';
import path from 'path';

export type GetProjectContext = Pick<
  ExecutorContext,
  | 'projectName'
  | 'cwd'
  | 'projectsConfigurations'
  | 'projectGraph'
  | 'workspace'
>;

export async function getProjectDependencies(
  projectName: string,
  graph: ProjectGraph
) {
  return {
    dependencies: getRecursiveDependencies(projectName, graph),
    graph,
  };
}

export function getProject(context: GetProjectContext) {
  if (!context.projectName) {
    throw new Error('No project name found in context.');
  }

  const project =
    context.projectsConfigurations?.projects?.[context.projectName] ??
    context.workspace?.projects?.[context.projectName];

  if (!project) {
    throw new Error(`Project ${context.projectName} not found in workspace`);
  }

  return project;
}

export function getProjectRoot(
  project: ProjectConfiguration | string,
  cwd: string
) {
  return path.join(cwd, typeof project === 'string' ? project : project.root);
}

export function getDefaultProjectRoot(context: GetProjectContext) {
  return getProjectRoot(getProject(context), context.cwd);
}

export function getRecursiveDependencies(
  projectName: string,
  graph: ProjectGraph
): string[] {
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
}
