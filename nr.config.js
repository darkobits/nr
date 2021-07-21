import { nr } from '@darkobits/ts';

export default nr(({ createScript }) => {
  createScript('babelOnly', {
    description: 'Compile with Babel only.',
    run: [
      'babel'
    ]
  })
});
