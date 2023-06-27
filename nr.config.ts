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

  if (!isCI) script('postBuild', { run: ['script:test.smoke'] });
});
