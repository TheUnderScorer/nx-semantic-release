import type { Context } from 'semantic-release';

export const createFakeSemanticReleaseLogger = () =>
  ({
    log: jest.fn(),
    error: jest.fn(),
  } as unknown as Context['logger']);
