<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/125690793-94572887-8b20-4914-aa53-68fe60d89b9a.png" style="max-width: 100%;">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/nr"><img src="https://img.shields.io/npm/v/@darkobits/nr.svg?style=flat-square"></a>
  <a href="https://github.com/darkobits/nr/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/workflow/status/darkobits/nr/CI/master?style=flat-square"></a>
  <a href="https://depfu.com/github/darkobits/nr"><img src="https://img.shields.io/depfu/darkobits/nr?style=flat-square"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/static/v1?label=commits&message=conventional&style=flat-square&color=398AFB"></a>
</p>

`nr` (shorthand for "[NPM run](https://docs.npmjs.com/cli/v7/commands/npm-run-script)") is a task runner for JavaScript projects. It can serve as a replacement for or complement to
traditional [NPM package scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts).

# Install

```
npm install --save-dev @darkobits/nr
```

This will install the package and create an executable in the local NPM bin path (ie:
`node_modules/.bin`). If your shell is configured to add this path to your `$PATH` variable, you can
invoke the CLI by simply running `nr`. Otherwise, you may invoke the CLI by running `npx nr`.

# Configure

`nr` is configured using a JavaScript configuration file, `nr.config.js`. `nr` will search for this file
in the directory from which it is invoked, and then every directory above it until a configuration file
is found.

A configuration file is responsible for creating **commands** and **scripts**. Commands describe the
invocation of a single executable and any arguments to be provided. Scripts compose commands that are to
be run sequentially, in parallel, or a combination of both.

A configuration file should export a function that will be passed an object that contains the following
keys:

| Key             | Description                        |
|-----------------|------------------------------------|
| `createCommand` | Function used to register commands.|
| `createScript`  | Function used to register scripts. |

These functions are documented in more detail below.

**Note:** `createScript` will check that any commands provided are valid. Therefore, any commands
referenced in a `createScript` call must be registered with `createCommand` _before_ they are used in
a script definition.

**Example:**

```js
module.exports = ({ createCommand, createScript }) => {
  createCommand({
    name: 'babel',
    command: 'babel',
    arguments: {
      _: ['src'],
      outDir: 'dist'
    }
  });

  createScript({
    name: 'build',
    commands: [
      'babel'
    ]
  });
};
```

We could then invoke the `build` script thusly:

```
nr build
```

### `createCommand(o: CreateCommandOptions): void`

This function accepts a single argument, [`CreateCommandOptions`](src/etc/types.ts#L13), and will
register a command using the indicated `name` that may then be used when defining scripts.

**Example:**

```js
module.exports = ({ createCommand, createScript }) => {
  // Lint the project.
  createCommand({
    name: 'lint',
    command: 'eslint',
    arguments: {
      _: ['src'],
      ext: '.ts,.tsx,.js,.jsx'
    }
  });

  const tscBaseArguments = {
    pretty: true
  };

  // Type-check and emit type declarations for the project.
  createCommand({
    name: 'tsc.emit',
    command: 'tsc',
    arguments: {
      ...tsBaseArguments,
      emitDeclarationOnly: true
    },
    preserveArguments: true
  });

  // Just type-check the project.
  createCommand({
    name: 'tsc.check',
    command: 'tsc',
    arguments: {
      ...tsBaseArguments,
      noEmit: true
    },
    preserveArguments: true
  });

  // Continuously type-check and emit declarations for the project.
  createCommand({
    name: 'tsc.watch',
    command: 'tsc',
    arguments: {
      ...tsBaseArguments,
      emitDeclarationOnly: true,
      watch: true,
      preserveWatchOutput: true
    },
    preserveArguments: true
  });
};
```

**A note on how name segments are used in commands:**

Dot-delimited name segments are used differently in commands than in scripts. Rather than supporting
matching, they control how output appears for that command. The log prefix for a command's output will
always be the first segment of a command's `name`. Therefore, we can define multiple commands that
execute Babel, or the TypeScript compiler, or Jest, using the same initial segment in the name and a
second segment that semantically describes what the command does.

In the above example configuration file, we define multiple commands that begin with a segment `tsc`.
Therefore, when output for these commands is logged, `nr` will use the same prefix `tsc` for their
output.

### `createScript(o: CreateScriptOptions): void`

This function accepts a single argument, [`CreateScriptOptions`](src/etc/types.ts#L63), and will
register a script using the indicated `name` that may be executed using the CLI.

**Example:**

```js
module.exports = ({ createCommand, createScript }) => {
  // Commands registered here.

  createScript({
    name: 'build',
    description: 'Test and lint in parallel, then build the project.',
    commands: [
      ['lint', 'test']
      'build'
    ]
  });

  createScript({
    name: 'test.coverage',
    description: 'Test the project and generate a coverage report.',
    commands: [
      'jest.coverage'
    ]
  });
};
```

# Use

Once you have created an `nr.config.js` file in your project and registered commands and scripts, you
may invoke a registered script using the `nr` CLI:

```
nr foo
```

## Script Name Matching

`nr` supports a matching feature that allows the user to pass a shorthand for the desired script name.
This is similar to NPS's name matching feature. Script names may be "segmented" using a single dot, and
the matcher will match each segment individually. The minimum number of characters you will need to
provide to invoke a particular script will vary based on how many scripts you have defined with similar
names.

For example, if we wanted to execute a script named `build.watch`, we could call:

```
nr b.w
```

## Listing Available Scripts

To have `nr` print a list of all registered scripts and their descriptions, pass the `--scripts` flag.
When this flag is provided, `nr` will ignore all other arguments and only print script information.

## Providing an Explicit Configuration File

To have `nr` skip searching for a configuration file and use a file at a particular path, pass the
`--config` flag with the path to the configuration file to use.

# Prior Art

`nr` was inspired by [NPS](https://github.com/sezna/nps), originally created by [Kent C. Dodds](https://kentcdodds.com/),
which itself was inspired by [a tweet](https://twitter.com/sindresorhus/status/724259780676575232) by
[Sindre is a Horse](https://sindresorhus.com/).

<br />
<a href="#top">
  <img src="https://user-images.githubusercontent.com/441546/102322726-5e6d4200-3f34-11eb-89f2-c31624ab7488.png" style="max-width: 100%;">
</a>
