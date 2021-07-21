module.exports = {
  extends: require('@darkobits/ts').eslint,
  rules: {
    'no-console': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/prefer-spread': 'off'
  }
};
