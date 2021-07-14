const {
  EXTENSIONS_WITH_DOT,
  OUT_DIR
} = require('@darkobits/ts/etc/constants');


module.exports = ({ createCommand, createScript }) => {
  createCommand({
    name: 'babel',
    command: 'babel',
    arguments: {
      _: ['src'],
      outDir: OUT_DIR,
      extensions: EXTENSIONS_WITH_DOT.join(','),
      ignore: '"**/*.d.ts"',
      copyFiles: true,
      sourceMaps: 'true',
      deleteDirOnStart: true
    }
  });

  createCommand({
    name: 'echo-test',
    command: 'echo',
    arguments: {
      _: ['Hello world!']
    }
  });

  createScript({
    name: 'prebuild',
    description: 'Does echo test before building.',
    commands: [
      'echo-test'
    ]
  });

  createScript({
    name: 'build',
    description: 'Build the project.',
    commands: [
      'babel'
    ]
  });
};
