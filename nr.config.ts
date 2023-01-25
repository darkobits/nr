import { nr } from '@darkobits/ts';

export default nr(({ script, task }) => {
  script('postBuild', {
    group: 'Build',
    run: [task('postBuild', () => {
      console.log('postBuild');
    })]
  });
});
