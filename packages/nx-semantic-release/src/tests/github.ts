import { Octokit } from '@octokit/rest';

export const githubClient = new Octokit({
  auth: process.env.GH_TOKEN,
});
