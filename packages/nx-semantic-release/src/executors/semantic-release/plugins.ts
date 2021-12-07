import path from 'path';
import fs from 'fs';
import { ExecutorContext } from '@nrwl/devkit';
import release from 'semantic-release';
import { SemanticReleaseOptions } from './semantic-release';
import { getDefaultProjectRoot } from '../../common/project';

const getNpmPlugin = (
  buildPath: string,
  context: ExecutorContext
): release.PluginSpec[] => {
  const projectRoot = getDefaultProjectRoot(context);
  const projectPkgPath = path.join(projectRoot, 'package.json');

  const buildPkgRoot = path.join(buildPath, 'package.json');

  const plugins: release.PluginSpec[] = [];

  if (fs.existsSync(buildPkgRoot)) {
    // Bump package.json version for built project, so that it can be published to NPM with correct version (if package is public)
    plugins.push([
      '@semantic-release/npm',
      {
        pkgRoot: buildPath,
      },
    ]);
  }

  if (fs.existsSync(projectPkgPath)) {
    // Bump package.json in project itself
    plugins.push([
      '@semantic-release/npm',
      {
        pkgRoot: projectRoot,
        npmPublish: false,
      },
    ]);
  }

  return plugins;
};

export const resolvePlugins = (
  options: SemanticReleaseOptions,
  context: ExecutorContext
) => {
  const projectRoot = getDefaultProjectRoot(context);
  const relativeProjectPath = path.relative(context.cwd, projectRoot);

  const emptyArray = [] as unknown as release.PluginSpec;
  const defaultPlugins: release.PluginSpec[] = [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        host: 'http://localhost',
      },
    ],

    ...(options.changelog
      ? [
          [
            '@semantic-release/changelog',
            {
              changelogFile: options.changelogFile,
            },
          ],
        ]
      : emptyArray),
    ...(options.npm ? getNpmPlugin(options.outputPath, context) : emptyArray),
    [
      '@semantic-release/git',
      {
        message: options.commitMessage,
        assets: [
          // Git requires relative paths from project root
          path.relative(context.cwd, options.changelogFile),
          path.join(relativeProjectPath, 'package.json'),
        ],
      },
    ],
  ];

  if (options.github) {
    defaultPlugins.push('@semantic-release/github');
  }

  return defaultPlugins;
};
