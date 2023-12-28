const { getJestProjects } = require('@nx/jest');

export default {
  projects: getJestProjects(),
  testTimeout: 200_000,
};
