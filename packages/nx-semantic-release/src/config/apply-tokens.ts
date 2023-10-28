import { SemanticReleaseOptions } from '../executors/semantic-release/semantic-release';
import deepMap from 'deep-map';

export interface ConfigTokensDict {
  relativeProjectDir: string;
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
      .replaceAll('${RELATIVE_PROJECT_DIR}', tokens.relativeProjectDir)
      .replaceAll('${PROJECT_DIR}', tokens.projectDir)
      .replaceAll('${PROJECT_NAME}', tokens.projectName)
      .replaceAll('${WORKSPACE_DIR}', tokens.workspaceDir);
  };

  return deepMap<SemanticReleaseOptions>(options, (value) => {
    if (typeof value === 'string') {
      return replaceTokens(value);
    }

    return value;
  });
}
