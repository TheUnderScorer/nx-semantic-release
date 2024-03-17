/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  remoteGitPath,
  remoteReposDirectory,
  testApps,
  testLibs,
} from './constants';
import { exec } from '../utils/exec';
import { getTestRepoCommits } from './git';
import { TestReleasableProject, TestRepoCommit } from './types';
import { wait } from './utils';
import fs from 'fs';
import { PackageJson } from 'type-fest';
import {
  readJson,
  runNxCommand,
  runNxCommandAsync,
  tmpProjPath,
  updateFile,
} from '@nx/plugin/testing';
import { NxJsonConfiguration } from 'nx/src/config/nx-json';
import { SemanticReleaseOptions } from '../executors/semantic-release/semantic-release';
import { ProjectConfiguration } from '@nx/devkit';
import path from 'path';
import { getStartPath } from './files';
import { setupTestNxWorkspace } from './setup-test-nx-workspace';

export interface SetupTestRepoResult {
  commits: TestRepoCommit[];
}

async function setupRemoteRepo() {
  await wait(250);

  if (!fs.existsSync(remoteReposDirectory)) {
    fs.mkdirSync(remoteReposDirectory, { recursive: true });
  }

  await exec(`git init --bare project.git -b master`, {
    cwd: remoteReposDirectory,
  });
}

async function addDescriptionToPkgJson() {
  const pkgPath = 'apps/app-a/package.json';
  const pkg = readJson<PackageJson>(pkgPath);

  pkg.description = 'Test repo';

  updateFile(pkgPath, JSON.stringify(pkg, null, 2));
}

async function initGit() {
  await setupRemoteRepo();

  await runCommandsInTestProj([
    'git init -b master',
    'git config user.email "test@example.com"',
    'git config user.name "Test"',
    'git add .',
    'git commit -m "chore: init"',
  ]);
}

export async function runCommandsInTestProj(
  commands: Array<string | (() => Promise<void>)>
) {
  for (const command of commands) {
    if (typeof command === 'string') {
      await exec(command, { cwd: tmpProjPath() });
    } else {
      await command();
    }
  }
}

function createPackageJsonForProjects() {
  const appAPkgJson: PackageJson = {
    name: 'app-a',
    version: '0.0.1',
    private: true,
  };
  const appBPkgJson: PackageJson = {
    name: 'app-b',
    version: '0.0.1',
    private: true,
  };
  const commonLibPkgJson: PackageJson = {
    name: '@proj/common-lib',
    version: '0.0.1',
    private: true,
  };

  updateFile('apps/app-a/package.json', JSON.stringify(appAPkgJson, null, 2));
  updateFile(
    'libs/common-lib/package.json',
    JSON.stringify(commonLibPkgJson, null, 2)
  );
  updateFile(
    'apps/app-b/stuff/package.json',
    JSON.stringify(appBPkgJson, null, 2)
  );
}

async function bootstrapTestProjectsAndLibs() {
  testApps.forEach((project) => {
    const command = `generate @nx/web:application apps/${project} --e2e-test-runner=none`;

    runNxCommand(command);
  });

  await wait(500);

  for (const lib of testLibs) {
    runNxCommand(`generate @nx/js:library libs/${lib} --unit-test-runner=none`);

    await wait(500);
  }

  createPackageJsonForProjects();
  updateWorkspaceNxConfig();
  linkDependencies();
  await runNxCommandAsync(
    `generate @theunderscorer/nx-semantic-release:install --repositoryUrl=file://${remoteGitPath} --enforceConventionalCommits=false`
  );

  configureSemanticReleaseForProject('app-a', {
    dryRun: false,
    buildTarget: 'build',
    github: false,
    ci: false,
    outputPath: 'dist/apps/app-a',
    commitMessage:
      'chore(app-a): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
    branches: ['*'],
    releaseRules: [
      {
        type: 'feat',
        scope: 'release-test',
        release: false,
      },
    ],
  });
  configureSemanticReleaseForProject('app-b', {
    dryRun: false,
    buildTarget: 'build',
    github: false,
    ci: false,
    outputPath: 'dist/apps/app-b',
    commitMessage:
      'chore(app-b): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
    branches: ['*'],
    packageJsonDir: '${PROJECT_DIR}/stuff',
  });
  configureSemanticReleaseForProject('app-c', {
    dryRun: false,
    buildTarget: 'build',
    github: false,
    ci: false,
    outputPath: 'dist/apps/app-b',
    commitMessage:
      'chore(app-c): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
    branches: ['*'],
    packageJsonDir: '${PROJECT_DIR}/stuff',
    parserOpts: {
      noteKeywords: ['CHANGE'],
    },
    writerOpts: {
      groupBy: false,
    },
  });
  configureSemanticReleaseForProject('common-lib', {
    executor: '@theunderscorer/nx-semantic-release:semantic-release',
    options: {
      dryRun: false,
      buildTarget: 'build',
      github: false,
      ci: false,
      outputPath: 'dist/libs/common-lib',
      commitMessage:
        'chore(common-lib): release ${nextRelease.version} [skip ci]\\n\\n${nextRelease.notes}',
      branches: ['*'],
    },
  });
}

function updateWorkspaceNxConfig() {
  const nxJson = readJson<NxJsonConfiguration>('nx.json');

  nxJson.namedInputs = {
    ...nxJson.namedInputs,
    sharedGlobals: ['{workspaceRoot}/test-only.txt'],
    default: ['sharedGlobals'],
  };

  nxJson.targetDefaults = {
    build: {
      dependsOn: ['^build'],
    },
    'semantic-release': {
      dependsOn: ['^semantic-release'],
    },
  };

  updateFile('nx.json', JSON.stringify(nxJson, null, 2));
}

function linkDependencies() {
  updateFile(
    'apps/app-a/src/main.ts',
    `
    import { libA } from '@proj/lib-a';

    console.log(libA());
    console.log('Hello world!');
  `
  );

  updateFile(
    'apps/app-b/src/main.ts',
    `
      import { commonLib } from '@proj/common-lib';

      commonLib();

      console.log('Hello World!');
  `
  );

  updateFile(
    'libs/lib-a/src/lib/lib-a.ts',
    `
      import { libADependency } from '@proj/lib-a-dependency';

      export function libA(): string {
        console.log('Running libA()...');

        libADependency();

        return 'lib-a';
      }
  `
  );

  updateFile(
    'libs/lib-a-dependency/src/lib/lib-a-dependency.ts',
    `
      import { commonLib } from '@proj/common-lib';

      export function libADependency(): string {
        commonLib();

        return 'lib-a-dependency';
      }
  `
  );
}

function configureSemanticReleaseForProject(
  project: TestReleasableProject,
  options: Partial<SemanticReleaseOptions>
) {
  const filePath = path.join(
    getStartPath(project, 'project'),
    project,
    'project.json'
  );

  let projectConfiguration = readJson<ProjectConfiguration>(filePath);

  projectConfiguration = {
    ...projectConfiguration,
    targets: {
      ...projectConfiguration.targets,
      'semantic-release': {
        executor: '@theunderscorer/nx-semantic-release:semantic-release',
        options,
      },
    },
  };

  updateFile(filePath, JSON.stringify(projectConfiguration, null, 2));
}

export async function setupTestRepo(
  withGit = true
): Promise<SetupTestRepoResult> {
  await setupTestNxWorkspace();

  if (withGit) {
    await initGit();
  }

  await bootstrapTestProjectsAndLibs();

  if (withGit) {
    await runCommandsInTestProj([
      'git add apps/app-a',
      'git commit -m "feat: add app-a"',
      'git add apps/app-b',
      'git commit -m "feat: add app-b"',
      'git add apps/app-c',
      'git commit -m "feat: add app-c" -m "CHANGE: Test"',
      'git add libs/lib-a libs/lib-a-dependency',
      'git commit -m "feat: add app-a libs"',
      'git add libs/common-lib',
      'git commit -m "feat: add common-lib"',
      'git add .',
      `git commit -m "feat: add rest"`,
      'echo "Test123" > apps/app-b/test.txt',
      'git add apps/app-b/test.txt',
      'git commit -m "feat: update test.txt"',
      'echo "Test123456" > apps/app-b/test.txt',
      'git add apps/app-b/test.txt',
      'git commit -m "feat: update test.txt again"',
      addDescriptionToPkgJson,
      'git add apps/app-a/package.json',
      'git commit -m "feat: add description\n\n[skip app-a]"',
      'echo "Test123456" > test-only.txt',
      'git add test-only.txt',
      'git commit -m "feat: add test-only.txt\n\n[only app-b]"',
      `git remote add origin ${remoteGitPath}`,
      'git push origin master',
    ]);

    const commits = getTestRepoCommits();

    return {
      commits,
    };
  }

  return {
    commits: [],
  };
}
