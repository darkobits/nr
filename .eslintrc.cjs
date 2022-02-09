module.exports = {
  extends: 'plugin:@darkobits/ts',
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    'no-console': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/prefer-spread': 'off'
  }
};
