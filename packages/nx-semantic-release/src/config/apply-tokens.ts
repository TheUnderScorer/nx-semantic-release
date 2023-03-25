import { SemanticReleaseOptions } from '../executors/semantic-release/semantic-release';

export interface ConfigTokensDict {
  projectDir: string;
  projectName: string;
}

export function applyTokensToSemanticReleaseOptions(
  options: SemanticReleaseOptions,
  tokens: ConfigTokensDict
) {
  const replaceTokens = (value: string): string => {
    return value
      .replace('${PROJECT_DIR}', tokens.projectDir)
      .replace('${PROJECT_NAME}', tokens.projectName);
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

  return options;
}
