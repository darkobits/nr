import LogFactory from '@darkobits/log';
import { nr } from '@darkobits/ts';


const log = LogFactory({ heading: 'nr' });

// Temporarily testing path mappings.
// import log from './src/lib/log';
// log.info('TESTING LOCAL PATH MAPPINGS');

export default nr(({ command, script, task, isCI }) => {
  if (!isCI) {
    script('postBuild', {
      group: 'Lifecycles',
      run: [
        [
          command.node('fixtures-cjs', ['./fixtures/cjs/index.js']),
          command.node('fixtures-esm', ['./fixtures/esm/index.js'])
        ],
        task('', () => {
          log.info(log.prefix('smokeTest'), 'CJS / ESM smoke tests passed.');
        })
      ]
    });
  }
});
