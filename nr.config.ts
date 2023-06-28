import { nr } from '@darkobits/ts';


export default nr(({ command, script, isCI }) => {
  script('test.smoke', {
    group: 'Test',
    description: 'Run smoke tests.',
    run: [
      command.node('smoke-test', ['./smoke-tests/esm/import.test.js']),
      command.node('smoke-test', ['./smoke-tests/cjs/dynamic-import.test.js']),
      command.node('smoke-test', ['./smoke-tests/cjs/require.test.js'])
    ],
    timing: true
  });

  if (!isCI) script('postBuild', {
    description: '[hook] If not in a CI environment, run smoke tests after building the project.',
    run: ['script:test.smoke']
  });
});
