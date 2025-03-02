import { defaultPackageScripts } from '@darkobits/ts'
import IS_CI from 'is-ci'

import { defineConfig } from '@darkobits/nr'

export default defineConfig([
  defaultPackageScripts,
  ({ command, script }) => {
    script('test.smoke', [[
      command.node('import.test.js', { cwd: './tests/fixtures/esm/' }),
      command.node('dynamic-import.test.js', { cwd: './tests/fixtures/cjs' }),
      command.node('require.test.js', { cwd: './tests/fixtures/cjs' })
    ]], {
      group: 'Test',
      description: 'Run smoke tests.',
      timing: true
    })

    if (!IS_CI) script('postBuild', 'script:test.smoke', {
      group: 'Lifecycle',
      description: '[hook] If not in a CI environment, run smoke tests after building the project.'
    })
  }
])