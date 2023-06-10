<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://user-images.githubusercontent.com/441546/220861827-236ad693-604e-482f-8f53-c1bb81f0643d.png"
      width="360"
    >
    <img
      src="https://user-images.githubusercontent.com/441546/220861827-236ad693-604e-482f-8f53-c1bb81f0643d.png"
      width="360"
    >
  </picture>
</p>
<p align="center">
  <a
    href="https://www.npmjs.com/package/@darkobits/nr"
  ><img
    src="https://img.shields.io/npm/v/@darkobits/nr.svg?style=flat-square"
  ></a>
  <a
    href="https://github.com/darkobits/nr/actions?query=workflow%3Aci"
  ><img
    src="https://img.shields.io/github/actions/workflow/status/darkobits/nr/ci.yml?style=flat-square"
  ></a>
  <a
    href="https://depfu.com/repos/github/darkobits/nr"
  ><img
    src="https://img.shields.io/depfu/darkobits/nr?style=flat-square"
  ></a>
  <a
    href="https://conventionalcommits.org"
  ><img
    src="https://img.shields.io/static/v1?label=commits&message=conventional&style=flat-square&color=398AFB"
  ></a>
    <a
    href="https://firstdonoharm.dev"
  ><img
    src="https://img.shields.io/static/v1?label=license&message=hippocratic&style=flat-square&color=753065"
  ></a>
</p>

<br />

`nr` (short for [`npm run`](https://docs.npmjs.com/cli/v7/commands/npm-run-script)) is a
[task runner](https://www.smashingmagazine.com/2016/06/harness-machines-productive-task-runners/) for
JavaScript projects.

It can serve as a replacement for or complement to traditional [NPM package scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts).

## Contents

- [Install](#install)
- [Philosophy](#philosophy)
- [Configure](#configure)
  - [`command`](#command)
  - [`task`](#task)
  - [`script`](#script)
  - [Type-safe Configuration & IntelliSense](#type-safe-configuration--intellisense)
- [Use](#use)
  - [Script Name Matching](#script-name-matching)
  - [Pre and Post Scripts](#pre-and-post-scripts)
  - [Discoverability](#discoverability)
  - [Providing an Explicit Configuration File](#providing-an-explicit-configuration-file)
- [Prior Art](#prior-art)

# Install

```
npm install --save-dev @darkobits/nr
```

This will install the package and create an executable in the local NPM bin path (ie:
`node_modules/.bin`). If your shell is [configured to add this location to your `$PATH`](https://gist.github.com/darkobits/ffaee26c0f322ce9e1a8b9b65697701d),
you can invoke the CLI by simply running `nr`. Otherwise, you may invoke the CLI by running `npx nr`.

You may install `nr` globally, but this is highly discouraged; a project that depends on `nr` should
enumerate it in its `devDependencies`, guaranteeing version compatibility. And, if your `$PATH` is
configured to include `$(npm bin)`, the developer experience is identical to installing `nr` globally.

# Philosophy

> _tl;dr Modern task runners don't need plugin systems._

When tools like Grunt and Gulp were conceived, it was common to build JavaScript projects by manually
streaming source files from one tool to another, each performing some specific modification before
writing the resulting set of files to an adjacent directory for distribution.

This pattern almost always relied on [Node streams](https://nodejs.org/api/stream.html), a notoriously
unwieldy API, resulting in the need for a [plugin](https://www.npmjs.com/search?q=gulp%20plugin) for
each tool that a task-runner supported, pushing a lot of complexity from build tools up to the
developers that used them.

Modern tools like Babel, Webpack, TypeScript, and Vite allow for robust enough configuration that they
can often perform all of these jobs using a single invocation of a (usually well-documented)
command-line interface, making the need for another layer of abstraction between the user and the CLI
superfluous.

Rather than relying on plugins to interface with tooling, `nr` provides an API for invoking other CLIs,
and a means to formalize these invocations in a JavaScript configuration file.

# Configure

`nr` is configured using a JavaScript configuration file, `nr.config.js`, or a TypeScript configuration
file, `nr.config.ts`. `nr` will search for this file in the directory from which it was invoked, and
then every directory above it until a configuration file is found.

A configuration file is responsible for creating **commands**, **tasks**, and **scripts**:

- **Commands** describe the invocation of a single executable and any arguments provided to it, as well
  as any configuration related to how the command will run, such as environment variables and how STDIN
  and STDOUT will be handled.
- **Tasks** are functions that may execute arbitrary code. They may be synchronous or asynchronous.
  Tasks can be used to interface with another program's Node API, for example.
- **Scripts** compose commands, tasks, and other scripts that may run sequentially, in parallel, or a
  combination of both.

A configuration file should export a function that will be passed a context object that contains the
following keys:

| Key                   | Type       | Description                                                                |
|-----------------------|------------|----------------------------------------------------------------------------|
| [`command`](#command) | `function` | Create a new command.                                                      |
| [`task`](#task)       | `function` | Create a new task.                                                         |
| [`script`](#script)   | `function` | Create a new script.                                                       |
| `isCI`                | `boolean`  | `true` in CI environments. See [`is-ci`](https://github.com/watson/is-ci). |

**Example:**

> `nr.config.js`

```js
export default ({ command, task, script }) => {
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

### `command`

| Parameter  | Type                                                    | Description               |
|------------|---------------------------------------------------------|---------------------------|
| `name`     | `string`                                                | Name of the command.      |
| `args`     | [`CommandArguments`](src/etc/types/CommandArguments.ts) | Executable and arguments. |
| `options?` | [`CommandOptions`](src/etc/types/CommandOptions.ts)     | Optional configuration.   |

| Return Type                                     | Description                                                |
|-------------------------------------------------|------------------------------------------------------------|
| [`CommandThunk`](src/etc/types/CommandThunk.ts) | Value that may be provided to `script` to run the command. |

This function accepts a name, an array indicating the executable and its arguments, [`CommandArguments`](src/etc/types/CommandArguments.ts),
and an optional options object, [`CommandOptions`](src/etc/types/CommandOptions.ts). It will register
the command using the provided `name` and return a value. To reference a command in a script, use either
the return value from `command` directly or a string in the format `cmd:name`. Commands are executed
using [`execa`](https://github.com/sindresorhus/execa).

[`CommandArguments`](src/etc/types/CommandArguments.ts) may take one of four forms:
* `[executable]` of type `[string]`
* `[executable, positionals]` of type `[string, Array<string>]`
* `[executable, flags]` of type `[string, Record<string, any>]`
* `[executable, positionals, flags]` of type `[string, Array<string>, Record<string, any>]`

**Example:**

> `nr.config.js`

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
    preserveArgumentCasing: true
  });
};
```

#### `command.node`

This function has the same signature as `command`. It can be used to execute a Node script using the
current version of Node. This variant uses [`execaNode`](https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options).

---

### `task`

| Parameter | Type                                | Description          |
|-----------|-------------------------------------|----------------------|
| `name`    | `string`                            | Name of the task.    |
| `taskFn`  | [`TaskFn`](src/etc/types/TaskFn.ts) | Function to execute. |

| Return Type                               | Description                                             |
|-------------------------------------------|---------------------------------------------------------|
| [`TaskThunk`](src/etc/types/TaskThunk.ts) | Value that may be provided to `script` to run the task. |

This function accepts a name and a function, [`TaskFn`](src/etc/types/TaskFn.ts), It will register the
task using the provided `name` and return a value. To reference a task in a script, use either the
return value from `task` directly or a string in the format `task:name`.

**Example:**

> `nr.config.js`

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

| Parameter | Type                                              | Description           |
|-----------|---------------------------------------------------|-----------------------|
| `name`    | `string`                                          | Name of the command.  |
| `options` | [`ScriptOptions`](src/etc/types/ScriptOptions.ts) | Script configuration. |

| Return Type                                   | Description                                               |
|-----------------------------------------------|-----------------------------------------------------------|
| [`ScriptThunk`](src/etc/types/ScriptThunk.ts) | Value that may be provided to `script` to run the script. |

This function accepts a name and an options object, [`ScriptOptions`](src/etc/types/ScriptOptions.ts).
It will register the script using the provided `name` and return a value. To reference a script in
another script, use either the return value from `script` directly or a string in the format
`script:name`.

The `run` option must be an array of [`Instruction`](src/etc/types/Instruction.ts) which may be:

* A reference to a command by name using a `string` in the format `cmd:name` or by value using the value
  returned by `command`.
* A reference to a task by name using a `string` in the format `task:name` or by value using the value
  returned by `task`.
* A reference to another script by name using a `string` in the format `script:name` or by value using
  the value returned by `script`.

To indicate that a group of [`Instructions`](src/etc/types/Instruction.ts) should be run in parallel,
wrap them in an array. However, no more than one level of array nesting is allowed. If you need more
complex parallelization, write separate, smaller scripts and compose them.

**Example:**

> `nr.config.js`

```js
export default ({ command, task, script }) => {
  command('build', ['babel', ['src'], { outDir: 'dist' }]);
  command('lint', ['eslint', ['src']]);
  command('test', ['jest']);
  task('done', () => {
    console.log('Excelsior!');
  });

  script('prepare', {
    description: 'Build and lint in parallel, then run unit tests.',
    run: [
      // Run these instructions in parallel.
      ['cmd:build', 'cmd:lint']
      // Then run this instruction.
      'cmd:test',
      // Then run this task.
      'task:done'
    ]
  });

  // Instructions (commands, tasks, and other scripts) can be referenced by
  // value, so they can be defined inline as well:
  script('test.coverage', {
    description: 'Test the project and generate a coverage report.',
    run: [
      // In such cases, the command's "name" is still significant; it is used
      // for error-reporting, and should therefore be descriptive.
      command('jest-coverage', ['jest', { coverage: true }]);
    ]
  });
};
```

> **Warning**
>
> Scripts will deference their instructions after the entire configuration file has been parsed. This
> means that if a script calls a command via a string token and something downstream re-defines a new
> command with the same name, the script will use the latter implementation of the command. This can be
> a powerful feature, allowing shareable configurations that users can modify in very specific ways. If
> you want to ensure that a script always uses a specific version of a command, use the pass-by-value
> method instead of a string token.

---

## Type-safe Configuration & IntelliSense

For users who want to ensure their configuration file is type-safe, or who want IntelliSense, you may
use a JSDoc annotation:

> `nr.config.js`

```js
/** @type {import('@darkobits/nr').ConfigurationFactory} */
export default ({ command, task, script }) => {

};
```

Alternatively, `nr` exports a helper which provides type-safety and IntelliSense without requiring a
JSDoc annotation:

> `nr.config.js`

```js
import nr from '@darkobits/nr';

export default nr(({ command, task, script }) => {

});
```

`nr` also supports TypeScript configuration files. Name your configuration file `nr.config.ts` and use
the helper for a fully type-safe experience.

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

## Script Name Matching

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

Like [NPM package scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts), `nr`
supports pre and post scripts. Once a query from the CLI is matched to a specific script, `nr` will look
for a script named `pre<scriptName>` and `post<scriptName>`. If found, these scripts will be run before
and after the matched script, respectively.

> 💡 **Protip**
>
> Because script name matching is case insensitive, a script named `build` may have pre and post scripts
> named `preBuild` and `postBuild`.

## Discoverability

Discoverability and self-documentation are encouraged with `nr`. While optional, consider leveraging the
`group` and/or `description` options when defining scripts. Thoughtfully organizing your scripts and
documenting what they do can go a long way in reducing friction for new contributors.

The `--commands`, `--tasks`, and `--scripts` flags may be passed to list information about all known
entities of that type. If `nr` detects that a command, task, or script was registered from a third-party
package, it will indicate the name of the package that created it.

A new contributor to a project may want an overview of available scripts, and may not be familiar with
with the `nr` CLI. To make this feature easily accessible, consider adding an NPM script to the
project's `package.json`:

```json
{
  "scripts": {
    "help": "nr --scripts"
  }
}
```

`npm run help` will now print instructions on how to interact with `nr`, what scripts are available, and
(hopefully) what each does.

## Providing an Explicit Configuration File

To have `nr` skip searching for a configuration file and use a file at a particular path, pass the
`--config` flag with the path to the configuration file to use.

# Prior Art

- [NPS](https://github.com/sezna/nps) - `nr` was heavily inspired by [NPS](https://github.com/sezna/nps),
  originally created by [Kent C. Dodds](https://kentcdodds.com/), which itself was inspired by [a tweet](https://twitter.com/sindresorhus/status/724259780676575232)
  by [Sindre is a Horse](https://sindresorhus.com/).
- [`npm-run-all`](https://www.npmjs.com/package/npm-run-all) - The original package scripts
  parallelization tool.
- [Grunt](https://github.com/gruntjs/grunt) - _The JavaScript task-runner_.
- [Gulp](https://github.com/gulpjs/gulp) - _The streaming build system_.

<br />
<a href="#top">
  <img src="https://user-images.githubusercontent.com/441546/189774318-67cf3578-f4b4-4dcc-ab5a-c8210fbb6838.png" style="max-width: 100%;">
</a>
