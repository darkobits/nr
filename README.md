<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/125690793-94572887-8b20-4914-aa53-68fe60d89b9a.png" style="max-width: 100%;">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/nr"><img src="https://img.shields.io/npm/v/@darkobits/nr.svg?style=flat-square"></a>
  <a href="https://github.com/darkobits/nr/actions?query=workflow%3Aci"><img src="https://img.shields.io/github/workflow/status/darkobits/nr/ci/master?style=flat-square"></a>
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

A configuration file is responsible for creating **commands**, **tasks**, and **scripts**.

**Commands** describe the invocation of a single executable and any arguments provided to it, as well as
any configuration related to how the command will run.

**Tasks** are functions that may execute arbitrary code. They may be synchronous or asynchronous. `nr`
will `await` these functions so that script pipelines behave the same way regardless of how a task is
implemented.

**Scripts** compose commands, tasks, and other scripts that may run sequentially, in parallel, or a
combination of both.

A configuration file should export a function that will be passed a context object that contains the
following keys:

| Key             | Description                                                           |
|-----------------|-----------------------------------------------------------------------|
| `command`       | Function used to register commands.                                   |
| `script`        | Function used to register scripts.                                    |
| `task`          | Function used to register tasks (user-provided JavaScript functions). |
| `isCI`          | Boolean value that will be `true` in CI environments.                 |

**Example:**

> `nr.config.js`

```js
export default ({ command, script, task }) => {
  const babelCmd = command('babel', ['babel', ['src'], { outDir: 'dist' }]);

  script('build', {
    group: 'Build Scripts',
    description: 'Transpile the project with Babel.'
    run: [
      // We can reference commands, tasks, and scripts by their return value:
      babelCmd,
      // Or, using a string with the 'cmd:' prefix followed by the command's
      // name. For tasks, use 'task:' and for scripts, use 'script:'.
      'cmd:babel'
    ]
  });
};
```

We can then invoke the `build` script thusly:

```
nr build
```

## Type-safe Configuration & IntelliSense

For users who want to ensure their configuration file is type-safe, or who want IntelliSense, you may
use a JSDoc annotation:

> `nr.config.js`

```js
/** @type {import('./dist/index').ConfigurationFactory} */
export default ({ command, task, script }) => {

};
```

Alternatively, `nr` exports a helper which provides type-safety and IntelliSense without requiring a
JSDoc annotation:

```js
import nr from '@darkobits/nr';

export default nr(({ command, task, script, isCI }) => {

});
```

`nr` also supports TypeScript configuration files. Name your configuration file `nr.config.ts` and use
the helper for a fully type-safe experience.

---

### `command`

| Parameter | Type                                             | Description               |
|-----------|--------------------------------------------------|---------------------------|
| `name`    | `string`                                         | Name of the command.      |
| `args`    | [`CreateCommandArguments`](src/etc/types.ts#L27) | Executable and arguments. |
| `opts?`   | [`CreateCommandOptions`](src/etc/types.ts#L41)   | Optional configuration.   |

| Return Type                            | Description                                                      |
|----------------------------------------|------------------------------------------------------------------|
| [`CommandThunk`](src/etc/types.ts#L75) | Value that may be provided to `createScript` to run the command. |

This function accepts a name, an array indicating the executable and its arguments, [`CreateCommandArguments`](src/etc/types.ts#L27),
and an optional options object, [`CreateCommandOptions`](src/etc/types.ts#L41). It will register the
command using the provided `name` and return a value. To reference a command in a script, use either the
return value from `command` directly or a string in the format `cmd:name`.

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
    'eslint', ['src'], { ext: '.ts,.tsx,.js,.jsx' }
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

---

### `task`

| Parameter | Type                             | Description          |
|-----------|----------------------------------|----------------------|
| `name`    | `string`                         | Name of the task.    |
| `taskFn`  | [`TaskFn`](src/etc/types.ts#L87) | Function to execute. |

| Return Type                         | Description                                             |
|-------------------------------------|---------------------------------------------------------|
| [`TaskThunk`](src/etc/types.ts#L93) | Value that may be provided to `script` to run the task. |

This function accepts a name and a task function, [`TaskFn`](src/etc/types.ts#L87), It will register the
task using the provided `name` and return a value. To reference a task in a script, use either the
return value from `task` directly or a string in the format `task:name`.

**Example:**

```js
export default ({ task, script }) => {
  const foo = task('foo', () => {
    console.log('bar');
  });

  script('foo', {
    run: [
      foo,
      // Or
      'task:foo'
    ]
  });
};
```

---

### `script`

| Parameter | Type                                           | Description           |
|-----------|------------------------------------------------|-----------------------|
| `name`    | `string`                                       | Name of the command.  |
| `opts`    | [`CreateScriptOptions`](src/etc/types.ts#L130) | Script configuration. |

| Return Type                            | Description                                                     |
|----------------------------------------|-----------------------------------------------------------------|
| [`ScriptThunk`](src/etc/types.ts#L191) | Value that may be provided to `createScript` to run the script. |

This function accepts name and an options object, [`CreateScriptOptions`](src/etc/types.ts#L130). It
will register the script using the provided `name` and return a value. To reference a script in another
script, use either the return value from `script` directly or a string in the format `script:name`.

The `run` option must be an array of [`Instruction`](src/etc/types.ts#L114) which may be:

* A reference to a command by name using a `string` in the format `cmd:name` or by value using the value
  returned by `command`.
* A reference to a task by name using a `string` in the format `task:name` or by value using the value
  returned by `task`.
* A reference to another script by name using a `string` in the format `script:name` or by value using
  the value returned by `script`.

To indicate that a group of [`Instructions`](src/etc/types.ts#L114) should be run in parallel, wrap them
in an array. However, no more than one level of array nesting is allowed. If you need more complex
parallelization, write separate, smaller scripts and compose them.

**Example:**

```js
export default ({ command, task, script }) => {
  command('build', ['babel', ['src'], { outDir: 'dist' }]);
  command('lint', ['eslint', ['src']]);
  command('test', ['jest']);
  task('done', () => {
    console.log('All done!');
  });

  script('build', {
    description: 'Test and lint in parallel, then build the project.',
    run: [
      // Run these instructions in parallel.
      ['cmd:build', 'cmd:lint']
      // Then run this instruction.
      'cmd:test',
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

> **Warning**
>
> Scripts will deference their instructions at the time the script is defined. For instructions passed
> by value, this means that if the value is changed after the invocation of `script`, the new value will
> not be used. For instructions referenced using a string, this means that if another instruction is
> created after the invocation of `script` that uses the same name as an instruction in the script
> (something `nr` permits), the script will still use the value as it was at the time `script` was
> invoked.

# Use

Once you have created an `nr.config.js` file in your project and registered commands, tasks, and
scripts, you may invoke a registered script using the `nr` CLI:

```
nr test.coverage
```

Or, using a shorthand:

```
nr t.c
```

More on this below.

## CLI Script Name Matching

`nr` supports a matching feature that allows the user to pass a shorthand for the desired script name.
Script names may be segmented using a dot, and the matcher will match each segment individually. The
minimum number of characters you will need to provide to invoke a particular script will vary based on
how many scripts you have defined with similar names.

For example, if we wanted to execute a script named `build.watch`, we could call:

```
nr b.w
```

Additionally, script name matching is case insensitive, so if we had a script named `testScript`, the
query `testscript` would successfully match it.

## Pre and Post Scripts

Like NPM package scripts, `nr` supports pre and post scripts. Once a query from the CLI is matched to
a specific script name, `nr` will look for a script named `pre<scriptName>` and `post<scriptName>`. If
found, these scripts will be run before and after the matched script, respectively.

## Listing Available Scripts

Discoverability is an important feature of `nr`. A new contributor to a project may want an easy
overview of available scripts, and may not be familiar with the `nr` CLI.

To have `nr` print a list of all registered scripts, their descriptions, and how to invoke `nr`, pass
the `--scripts` flag. When this flag is provided, `nr` will ignore all other arguments and only print
script information. Scripts will be grouped according to their `group` value.

To make this feature easily accessible, consider adding an NPM script to your `package.json`:

```json
{
  "scripts": {
    "help": "nr --scripts"
  }
}
```

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
