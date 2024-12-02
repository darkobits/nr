
// Note: This is how nr must be imported from a CJS context when it is compiled
// as ESM.
async function main() {
  const { createLogger } = await import('@darkobits/log')
  const log = createLogger({ heading: 'smokeTest' })

  try {
    const { defineConfig } = await import('../../../dist/index.js')
    if (typeof defineConfig !== 'function') throw new Error('Dynamic import of this package failed.')
    log.verbose(log.chalk.dim.cyan('cjs:dynamic-import'), log.chalk.green('success'))
  } catch (err) {
    log.error(log.chalk.dim.cyan('cjs:dynamic-import'), err)
  }
}

void main()