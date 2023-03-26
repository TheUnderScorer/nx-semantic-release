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

    it('should skip commit if [skip project, project2] flag is set', () => {
      const result1 = shouldSkipCommit(
        {
          body: '[skip project, project2]',
        },
        'project'
      );

      expect(result1).toEqual(true);

      const result2 = shouldSkipCommit(
        {
          body: '[skip project, project2]',
        },
        'project2'
      );

      expect(result2).toEqual(true);
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

    it('should not skip commit if [skip project, project2] flag is not set in the body', () => {
      const result1 = shouldSkipCommit(
        {
          body: '',
        },
        'project'
      );

      expect(result1).toEqual(false);

      const result2 = shouldSkipCommit(
        {
          body: '',
        },
        'project2'
      );

      expect(result2).toEqual(false);
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


    it('should skip commit if it has [only other-project, other-project2,] flag', () => {
      const result = shouldSkipCommit(
        {
          body: '[only other-project, other-project2]',
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

    it('should not skip commit if it includes [only project, project2] flag', () => {
      const result1 = shouldSkipCommit(
        {
          body: '[only project, project2]',
        },
        'project'
      );

      expect(result1).toEqual(false);

      const result2 = shouldSkipCommit(
        {
          body: '[only project, project2]',
        },
        'project2'
      );

      expect(result2).toEqual(false);
    });
  });
});
