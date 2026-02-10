module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'issue-number-required': ({ subject }) => {
          const issuePattern = /#\d+/;
          if (!subject || !issuePattern.test(subject)) {
            return [
              false,
              'commit message must include issue number (e.g., #123)',
            ];
          }
          return [true];
        },
      },
    },
  ],
  rules: {
    'issue-number-required': [2, 'always'],
    'type-enum': [
      2,
      'always',
      ['fix', 'feat', 'enhancement', 'docs', 'chore', 'hotfix', 'test', 'refactor'],
    ],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 300],
    'header-max-length': [2, 'always', 300],
    'subject-case': [0],
  },
};
