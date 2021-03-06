import { wrapStep } from 'semantic-release-plugin-decorators';
import { getCommitsForProject } from './analyze-commits';

export * from './executor-context';

const analyzeCommits = wrapStep('analyzeCommits', getCommitsForProject(true), {
  wrapperName: 'nx-semantic-release',
});

const generateNotes = wrapStep('generateNotes', getCommitsForProject(false), {
  wrapperName: 'nx-semantic-release',
});

const success = wrapStep('success', getCommitsForProject(false), {
  wrapperName: 'nx-semantic-release',
});

const prepare = wrapStep('prepare', getCommitsForProject(false), {
  wrapperName: 'nx-semantic-release',
});

export { analyzeCommits, generateNotes, success, prepare };
