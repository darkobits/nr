import { nr } from '@darkobits/ts';
// import nr from './dist/index.js';


export default nr(({ command, script, isCI }) => {
  // Legacy format
  // script('test.smoke', {
  //   group: 'Test',
  //   description: 'Run smoke tests.',
  //   run: [
  //     command.node('smoke-test', ['import.test.js'], {
  //       execaOptions: {
  //         cwd: './smoke-tests/esm/'
  //       }
  //     }),
  //     command.node('smoke-test', ['dynamic-import.test.js'], {
  //       execaOptions: {
  //         cwd: './smoke-tests/cjs'
  //       }
  //     }),
  //     command.node('smoke-test', ['require.test.js'], {
  //       execaOptions: {
  //         cwd: './smoke-tests/cjs'
  //       }
  //     })
  //   ],
  //   timing: true
  // });

  // if (!isCI) script('postBuild', {
  //   description: '[hook] If not in a CI environment, run smoke tests after building the project.',
  //   run: ['script:test.smoke']
  // });

  // Modern format
  // @ts-ignore
  // script([
  //   command.node('import.test.js', {
  //     name: 'smoke-test:esm-import',
  //     cwd: './smoke-tests/esm/'
  //   }),
  //   command.node('dynamic-import.test.js', {
  //     name: 'smoke-test:cjs-dynamic-import',
  //     cwd: './smoke-tests/cjs'
  //   }),
  //   command.node('require.test.js', {
  //     name: 'smoke-test:cjs-require',
  //     cwd: './smoke-tests/cjs'
  //   })
  // ], {
  //   name: 'test.smoke',
  //   group: 'Test',
  //   description: 'Run smoke tests.',
  //   timing: true
  // });

  // if (!isCI) script([
  //   'script:test.smoke'
  // ], {
  //   name: 'postBuild',
  //   group: 'Lifecycle',
  //   description: '[hook] If not in a CI environment, run smoke tests after building the project.'
  // });
});
