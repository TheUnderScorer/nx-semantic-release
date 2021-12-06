import release from 'semantic-release';

export const createFakeSemanticReleaseLogger =
  (): release.Context['logger'] => ({
    log: jest.fn(),
    error: jest.fn(),
  });
