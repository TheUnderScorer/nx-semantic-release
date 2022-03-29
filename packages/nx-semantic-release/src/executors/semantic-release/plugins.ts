import path from 'path';
import fs from 'fs';
import { ExecutorContext } from '@nrwl/devkit';
import release from 'semantic-release';
import { SemanticReleaseOptions } from './semantic-release';
import { getDefaultProjectRoot } from '../../common/project';

const getNpmPlugin = (
  context: ExecutorContext,
  options: SemanticReleaseOptions
): release.PluginSpec[] => {
  const packageJsonDir =
    options.packageJsonDir ?? getDefaultProjectRoot(context);
  const projectPkgPath = path.join(packageJsonDir, 'package.json');

  const buildPkgRoot = options.outputPath
    ? path.join(options.outputPath, 'package.json')
    : undefined;

  const plugins: release.PluginSpec[] = [];

  if (buildPkgRoot && fs.existsSync(buildPkgRoot)) {
    // Bump package.json version for built project, so that it can be published to NPM with correct version (if package is public)
    plugins.push([
      '@semantic-release/npm',
      {
        pkgRoot: options.outputPath,
      },
    ]);
  }

  if (fs.existsSync(projectPkgPath)) {
    // Bump package.json in project itself
    plugins.push([
      '@semantic-release/npm',
      {
        pkgRoot: packageJsonDir,
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
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: options.parserOpts,
        releaseRules: options.releaseRules,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        linkCompare: options.linkCompare,
        linkReferences: options.linkReferences,
        parserOpts: options.parserOpts,
        writerOpts: options.writerOpts,
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
    ...(options.npm ? getNpmPlugin(context, options) : emptyArray),
    ...(options.plugins ?? []),
    [
      '@semantic-release/git',
      {
        message: options.commitMessage,
        assets: [
          // Git requires relative paths from project root
          path.relative(context.cwd, options.changelogFile),
          path.join(relativeProjectPath, 'package.json'),
          ...(options.gitAssets ?? []),
        ],
      },
    ],
  ];

  if (options.github) {
    defaultPlugins.push('@semantic-release/github');
  }

  return defaultPlugins;
};
