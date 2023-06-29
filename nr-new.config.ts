// import { nr } from '@darkobits/ts';
import nr from './dist/index.js';


export default nr(({ command, script, task, isCI }) => {
  const vite = command('vite', {
    name: 'vite-build',
    args: ['build', { logLevel: 'warn' }]
  });

  script([
    // 'cmd:vite-build',
    false,
    vite,
    task(() => {
      console.log('it works!');
    })
  ], {
    name: 'build',
    timing: true
  });

  script([
    command.node('import.test.js', {
      name: 'smoke-tests:esm-import',
      cwd: './smoke-tests/esm'
    }),
    command.node('dynamic-import.test.js', {
      name: 'smoke-tests:cjs-dynamic-import',
      cwd: './smoke-tests/cjs'
    }),
    command.node('require.test.js', {
      name: 'smoke-tests:cjs-require',
      cwd: './smoke-tests/cjs'
    })
  ], {
    name: 'test.smoke',
    group: 'Test',
    description: 'Run tests.',
    timing: true
  });

  if (!isCI) script('script:test.smoke', {
    name: 'postBuild',
    group: 'Lifecycle',
    description: '[hook] If not in a CI environment, run smoke tests after building the project.'
  });
});
