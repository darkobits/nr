module.exports = {
  extends: 'plugin:@darkobits/ts',
  ignorePatterns: ['fixtures/**'],
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    'no-console': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/import-style': 'off'
  }
};
