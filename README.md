<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/125690793-94572887-8b20-4914-aa53-68fe60d89b9a.png" style="max-width: 100%;">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/nr"><img src="https://img.shields.io/npm/v/@darkobits/nr.svg?style=flat-square"></a>
  <a href="https://github.com/darkobits/nr/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/workflow/status/darkobits/nr/ci/master?style=flat-square"></a>
  <a href="https://depfu.com/repos/github/darkobits/nr"><img src="https://img.shields.io/depfu/darkobits/nr?style=flat-square"></a>
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

A configuration file is responsible for creating **commands** and **scripts**.

**Commands** describe the invocation of a single executable and any arguments provided to it, as well as
any configuration related to how the command will run.

**Scripts** compose commands and other scripts that may run sequentially, in parallel, or a combination of
both.

A configuration file should export a function that will be passed an object that contains the following
keys:

| Key             | Description                                                           |
|-----------------|-----------------------------------------------------------------------|
| `command`       | Function used to register commands.                                   |
| `script`        | Function used to register scripts.                                    |
| `task`          | Function used to register tasks (user-provided JavaScript functions). |

These functions are documented in more detail below.

**Note:** `createScript` will check that any commands/scripts provided are valid. Therefore, any
commands or scripts referenced in a `createScript` call must be registered _before_ they are used in
a script definition.

**Example:**

```js
module.exports = ({ command, script }) => {
  // Note the first argument here (the command's name) will be used to reference
  // it below.
  command('babel', ['babel', ['src'], { outDir: 'dist' }]);

  script('build, {
    group: 'Build Scripts',
    run: [
      'babel'
    ]
  });
};
```

We could then invoke the `build` script thusly:

```
nr build
```

### `command`

| Parameter | Type                                             | Description               |
|-----------|--------------------------------------------------|---------------------------|
| `name`    | `string`                                         | Name of the command.      |
| `args`    | [`CreateCommandArguments`](src/etc/types.ts#L34) | Executable and arguments. |
| `opts?`   | [`CreateCommandOptions`](src/etc/types.ts#L48)   | Optional configuration.   |

| Return Type                            | Description                                                      |
|----------------------------------------|------------------------------------------------------------------|
| [`CommandThunk`](src/etc/types.ts#L82) | Value that may be provided to `createScript` to run the command. |

This function accepts a name, an array indicating the executable and its arguments, [`CreateCommandArguments`](src/etc/types.ts#L34),
and an optional options object, [`CreateCommandOptions`](src/etc/types.ts#L48). It will register the
command using the provided `name` and return a value. When referencing a command in a script, either
the `name` or the return value of this function may be used.

[`CreateCommandArguments`](src/etc/types.ts#L34) may take one of four forms:
* `[executable]` of type `[string]`
* `[executable, positionals]` of type `[string, Array<string>]`
* `[executable, flags]` of type `[string, Record<string, any>]`
* `[executable, positionals, flags]` of type `[string, Array<string>, Record<string, any>]`

**Example:**

```js
export default ({ command, script }) => {
  // Lint the project.
  command('eslint', [
    // Executable + positional arguments + flags.
    'eslint' ['src'], { ext: '.ts,.tsx,.js,.jsx' }
  ]);

  // Type-check and emit type declarations for the project.
  command('tsc.emit', [
    // Executable + flags.
    'tsc', { emitDeclarationOnly: true }
  ], {
    // Do not convert flags to kebab-case.
    preserveArguments: true
  });
};
```

### `script`

| Parameter | Type                                           | Description           |
|-----------|------------------------------------------------|-----------------------|
| `name`    | `string`                                       | Name of the command.  |
| `opts`    | [`CreateScriptOptions`](src/etc/types.ts#L121) | Script configuration. |

| Return Type                            | Description                                                     |
|----------------------------------------|-----------------------------------------------------------------|
| [`ScriptThunk`](src/etc/types.ts#L192) | Value that may be provided to `createScript` to run the script. |

This function accepts name and an options object, [`CreateScriptOptions`](src/etc/types.ts#L121). It will
register the script using the provided `name` and return a value. When referencing a script in another
script, either the `name` or the return value of this function may be used.

The `run` option must be an array of [`Instruction`](src/etc/types.ts#L115) which may be:

* A reference to a command by name using a `string` or by value using the value returned by the
  `command` function.
* A reference to another script by name using a `string` or by value using the value returned by the
  `script` function.

If a string is encountered and it matches the names of multiple scripts, commands, or tasks, an error
will be thrown and you will be asked to disambiguate the instruction. You may do this by either changing
one of the duplicate names, or by prefixing the instruction with `script:`, `cmd:`, or `task:` to
indicate the intended instruction.

To indicate that a group of [`Instructions`](src/etc/types.ts#L115) should be run in parallel, wrap them
in another array. However, no more than one level of array nesting is allowed. If you need more complex
parallelization, write separate, smaller scripts and compose them.

**Example:**

This example uses the optional prefixes for instructions to demonstrate their use.

```js
export default ({ command, task, script }) => {
  command('compile', ['babel', ['src'], { outDir: 'dist' }]);
  command('lint', ['eslint', ['src']]);
  command('test', ['jest']);
  task('done', () => {
    console.log('All done!');
  });

  script('build', {
    description: 'Test and lint in parallel, then build the project.',
    run: [
      // Run these instructions in parallel.
      ['cmd:lint', 'cmd:test']
      // Then run this instruction.
      'cmd:compile',
      'task:done'
    ]
  });

  // Instructions (commands, tasks, and other scripts) can be referenced by
  // value, so they can be defined inline as well:
  script('test.coverage', {
    description: 'Test the project and generate a coverage report.',
    run: [
      // In such cases, the command's "name" is less important, but it will
      // still be used for error reporting, and should therefore be descriptive.
      command('jest-coverage', ['jest', { coverage: true }]);
    ]
  });
};
```

# Use

Once you have created an `nr.config.js` file in your project and registered commands, tasks, and
scripts, you may invoke a registered script using the `nr` CLI:

```
nr test.coverage
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
Scripts will be grouped according to their `group` value.

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
