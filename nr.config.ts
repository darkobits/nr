import { nr } from '@darkobits/ts';
// import nr from './dist/index.js';


export default nr(({ command, script, isCI }) => {
  // Modern format
  script([
    command.node('import.test.js', { cwd: './smoke-tests/esm/' }),
    command.node('dynamic-import.test.js', { cwd: './smoke-tests/cjs' }),
    command.node('require.test.js', { cwd: './smoke-tests/cjs' })
  ], {
    name: 'test.smoke',
    group: 'Test',
    description: 'Run smoke tests.',
    timing: true
  });

  if (!isCI) script('script:test.smoke', {
    name: 'postBuild',
    group: 'Lifecycle',
    description: '[hook] If not in a CI environment, run smoke tests after building the project.'
  });
});
