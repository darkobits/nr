import { nr } from '@darkobits/ts';

export default nr(({ command, script, isCI }) => {
  if (!isCI) {
    script('postBuild', {
      group: 'Lifecycles',
      run: [
        [
          command.node('fixtures-cjs', ['./fixtures/cjs/index.js']),
          command.node('fixtures-esm', ['./fixtures/esm/index.js'])
        ]
      ]
    });
  }
});
