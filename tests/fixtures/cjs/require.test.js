const LogFactory = require('@darkobits/log');

const log = LogFactory({ heading: 'smokeTest' });

// Note: We should not be able to require() this package because it is compiled
// as ESM. If we get an ERR_REQUIRE_ESM, the test will still pass. Any other
// error will result in a failure.
try {
  const { defineConfig } = require('../../../dist');
  if (typeof defineConfig !== 'function') throw new Error('[fixtures:cjs] "require" failed.');
  log.verbose(log.prefix('cjs:require'), log.chalk.green('success'));
} catch (err) {
  if (err.message.includes('require() of ES Module')) {
    log.verbose(log.prefix('cjs:require'), log.chalk.yellow.dim('require() of this package failed'));
  } else {
    log.error(log.prefix('cjs:require'), err);
    process.exit(1);
  }
}
