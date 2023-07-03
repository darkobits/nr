import LogFactory from '@darkobits/log';

const log = LogFactory({ heading: 'smokeTest' });

import defaultExport from '../../../dist/index.js';

if (typeof defaultExport !== 'function') {
  log.error(log.prefix('esm:import'), `Expected type of default export to be "function", got "${typeof defaultExport}".`);
  process.exit(1);
} else {
  log.verbose(log.prefix('esm:import'), log.chalk.green('success'));
}
