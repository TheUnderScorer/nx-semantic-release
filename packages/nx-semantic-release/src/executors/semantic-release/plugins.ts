import path from 'path';
import fs from 'fs';
import { ExecutorContext } from '@nx/devkit';
import { PluginSpec } from 'semantic-release';
import { SemanticReleaseOptions } from './semantic-release';
import { getDefaultProjectRoot } from '../../common/project';

const getNpmPlugin = (
  context: ExecutorContext,
  options: SemanticReleaseOptions
): PluginSpec[] => {
  const packageJsonDir =
    options.packageJsonDir ?? getDefaultProjectRoot(context);
  const projectPkgPath = path.join(packageJsonDir, 'package.json');

  const buildPkgRoot = options.outputPath
    ? path.join(options.outputPath, 'package.json')
    : undefined;

  const plugins: PluginSpec[] = [];

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
  const packageJsonDir =
    options.packageJsonDir ?? getDefaultProjectRoot(context);
  const relativeProjectPkgPath = path.relative(context.cwd, packageJsonDir);

  const emptyArray = [] as unknown as PluginSpec;
  const defaultPlugins: PluginSpec[] = [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: options.parserOpts,
        releaseRules: options.releaseRules,
        preset: options.preset,
        presetConfig: options.presetConfig,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        linkCompare: options.linkCompare,
        linkReferences: options.linkReferences,
        parserOpts: options.parserOpts,
        writerOpts: options.writerOpts,
        preset: options.preset,
        presetConfig: options.presetConfig,
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
    ...(options.plugins ?? []),
  ];

  if (options.git) {
    defaultPlugins.push([
      '@semantic-release/git',
      {
        message: options.commitMessage,
        assets: [
          // Git requires relative paths from project root in a posix format
          path
            .relative(context.cwd, options.changelogFile as string)
            .split(path.sep)
            .join(path.posix.sep),
          path
            .join(relativeProjectPkgPath, 'package.json')
            .split(path.sep)
            .join(path.posix.sep),
          ...(options.gitAssets ?? []),
        ],
      },
    ]);
  }

  if (options.npm) {
    defaultPlugins.push(...getNpmPlugin(context, options));
  }

  if (options.github) {
    defaultPlugins.push(['@semantic-release/github', options.githubOptions]);
  }

  return defaultPlugins;
};
