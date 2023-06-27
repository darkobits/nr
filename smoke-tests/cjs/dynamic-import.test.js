const LogFactory = require('@darkobits/log');

const log = LogFactory({ heading: 'smokeTest' });


// Note: This is how nr must be imported from a CJS context when it is compiled
// as ESM.
async function main() {
  const nr = (await import('../../dist/index.js')).default;
  if (typeof nr !== 'function') throw new Error('Dynamic import of this package failed.');
}


void main().then(() => {
  log.verbose(log.prefix('cjs:dynamic-import'), log.chalk.green('success'));
}).catch(err => {
  log.error(log.prefix('cjs:dynamic-import'), err);
  process.exit(1);
});
