import { shouldSkipCommit } from './git';

describe('git', () => {
  describe('shouldSkipCommit', () => {
    it('should skip commit if [skip project] flag is set', () => {
      const result = shouldSkipCommit(
        {
          body: '[skip project]',
        },
        'project'
      );

      expect(result).toEqual(true);
    });

    it('should skip commit if [skip all] flag is set', () => {
      const result = shouldSkipCommit(
        {
          body: '[skip all]',
        },
        'project'
      );

      expect(result).toEqual(true);
    });

    it('should not skip commit if [skip project] flag is not set in the body', () => {
      const result = shouldSkipCommit(
        {
          body: '',
        },
        'project'
      );

      expect(result).toEqual(false);
    });

    it('should skip commit if it has [only other-project] flag', () => {
      const result = shouldSkipCommit(
        {
          body: '[only other-project]',
        },
        'project'
      );

      expect(result).toEqual(true);
    });

    it('should not skip commit if it includes [only project] flag', () => {
      const result = shouldSkipCommit(
        {
          body: '[only project]',
        },
        'project'
      );

      expect(result).toEqual(false);
    });
  });
});
