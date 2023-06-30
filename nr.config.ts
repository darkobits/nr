import { nr } from '@darkobits/ts';


export default nr(({ command, script, isCI }) => {
  script('test.smoke', [
    command.node('import.test.js', { cwd: './smoke-tests/esm/' }),
    command.node('dynamic-import.test.js', { cwd: './smoke-tests/cjs' }),
    command.node('require.test.js', { cwd: './smoke-tests/cjs' })
  ], {
    group: 'Test',
    description: 'Run smoke tests.',
    timing: true
  });

  if (!isCI) script('postBuild', 'script:test.smoke', {
    group: 'Lifecycle',
    description: '[hook] If not in a CI environment, run smoke tests after building the project.'
  });
});
