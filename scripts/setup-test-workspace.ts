import * as path from 'path';
import * as fs from 'fs';
import { logger, ProjectConfiguration, Workspace } from '@nrwl/devkit';
import {
  remoteGitPath,
  testProjects,
} from '../packages/nx-semantic-release/src/tests/constants';

const workspaceJsonDistPath = path.resolve(
  __dirname,
  '../test-repos/app/workspace.dist.json'
);

const workspaceJsonPath = path.resolve(
  __dirname,
  '../test-repos/app/workspace.json'
);

fs.copyFileSync(workspaceJsonDistPath, workspaceJsonPath);

logger.info(`Created workspace.json file at ${workspaceJsonPath}`);

const workspace = JSON.parse(
  fs.readFileSync(workspaceJsonPath, 'utf8')
) as Workspace;

const repositoryUrl = `file://${path.resolve(remoteGitPath)}`;

logger.info(`Remote repository url: ${repositoryUrl}`);

testProjects.forEach((projectName) => {
  const project = workspace.projects[projectName] as ProjectConfiguration;

  project.targets!['semantic-release'].options.repositoryUrl = repositoryUrl;
});

fs.writeFileSync(workspaceJsonPath, JSON.stringify(workspace, null, 2));

logger.info(`Test workspace is ready 😎`);
