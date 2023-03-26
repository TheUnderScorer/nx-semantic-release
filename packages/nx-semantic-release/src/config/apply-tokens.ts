import { SemanticReleaseOptions } from '../executors/semantic-release/semantic-release';

export interface ConfigTokensDict {
  projectDir: string;
  projectName: string;
  workspaceDir: string;
}

export function applyTokensToSemanticReleaseOptions(
  options: SemanticReleaseOptions,
  tokens: ConfigTokensDict
) {
  const replaceTokens = (value: string): string => {
    return value
      .replaceAll('${PROJECT_DIR}', tokens.projectDir)
      .replaceAll('${PROJECT_NAME}', tokens.projectName)
      .replaceAll('${WORKSPACE_DIR}', tokens.workspaceDir);
  };

  [
    'buildTarget',
    'changelogFile',
    'commitMessage',
    'packageJsonDir',
    'tagFormat',
    'outputPath'
  ].forEach((option) => {
    if (options[option]) options[option] = replaceTokens(options[option]);
  });

  if (options.gitAssets?.length)
    options.gitAssets = options.gitAssets.map((asset) => replaceTokens(asset));

  if (options.plugins?.length) {  // replace token in plugin's (string, string[]) options (when provided)
    options.plugins = options.plugins.map((plugin) => {
      if (typeof plugin === 'string') {
        return plugin; // no option provided, no replacement necessary
      }
      else {
        const [pluginName, pluginOptions] = plugin;
        const newPluginOptions = Object.entries(pluginOptions).reduce(
          (newOptions, [key, value]) => ({
            ...newOptions,
            [key]: typeof value === 'string' ?
              replaceTokens(value) :
              (Array.isArray(value) ? value.map(v => typeof v === 'string' ? replaceTokens(v) : v) : value),
          }),
          {}
        );
        return [pluginName, newPluginOptions];
      }
    })
  }

  return options;
}
