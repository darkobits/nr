import { ts } from '@darkobits/eslint-plugin'

export default [
  {
    ignores: ['fixtures/**']
  },
  ...ts,
  {
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      'no-console': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/import-style': 'off',
      // TODO: Disable this in eslint-plugin.
      'unicorn/expiring-todo-comments': 'off',
      'import/namespace': 'off',
      'unicorn/no-process-exit': 'off'
    }
  }
]