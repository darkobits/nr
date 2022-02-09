import match from './matcher';


describe('matcher', () => {
  const scripts = [
    'build',
    'test',
    'prepare',
    'build.watch',
    'test.watch',
    'backend.build',
    'backend.deploy',
    'backend.deploy.dev',
    'backend.deploy.prod',
    'backend.deploy.production'
  ];

  it('should match the first character of each segment', () => {
    expect(match(scripts, 't.w')).toBe('test.watch');
  });

  it('should match the first character and any in-order sequence of characters thereafter', () => {
    expect(match(scripts, 'te.wa')).toBe('test.watch');
    expect(match(scripts, 'tst.wtch')).toBe('test.watch');
    expect(match(scripts, 'be.d.dv')).toBe('backend.deploy.dev');
  });

  it('should match on exact script names, even if other partial matches exist', () => {
    expect(match(scripts, 'backend.deploy')).toBe('backend.deploy');
  });

  it('should throw on ambiguous matches', () => {
    expect(() => {
      match(scripts, 'be.dep.prod');
    }).toThrow('Multiple scripts matched');
  });
});
