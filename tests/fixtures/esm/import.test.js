import { createLogger } from '@darkobits/log'

const log = createLogger({ heading: 'smokeTest' })

import { defineConfig } from '../../../dist/index.js'

if (typeof defineConfig !== 'function') {
  log.error(log.chalk.dim.cyan('esm:import'), `Expected type of default export to be "function", got "${typeof defaultExport}".`)
  process.exit(1)
} else {
  log.verbose(log.chalk.dim.cyan('esm:import'), log.chalk.green('success'))
}