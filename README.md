<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://github.com/darkobits/nr/assets/441546/deaf314e-3b55-4bb5-89f7-0991c6300c6c"
      width="360"
    >
    <img
      src="https://github.com/darkobits/nr/assets/441546/deaf314e-3b55-4bb5-89f7-0991c6300c6c"
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

When tools like Grunt and Gulp were conceived, it was common to build JavaScript projects by explicitly
streaming source files from one tool to another, each performing some specific modification before
writing the resulting set of files to an adjacent directory for distribution.

This pattern almost always relied on [Node streams](https://nodejs.org/api/stream.html), a notoriously
unwieldy API, resulting in the need for a [plugin](https://www.npmjs.com/search?q=gulp%20plugin) for
each tool that a task-runner supported, pushing a lot of complexity from build tools up to the
developers that used them.

Modern tools like Babel, Webpack, TypeScript, and Vite allow for robust enough configuration that they
can often perform all of these jobs using a single invocation of a (usually well-documented)
command-line interface, making plugin systems a superfluous layer of abstraction between the user and
the CLI.

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
- **Tasks** are JavaScript functions that may execute arbitrary code. They may be synchronous or
  asynchronous. Tasks can be used to interface with another program's Node API, or to perform any
  in-process work that does not rely on the invocation of an external CLI.
- **Scripts** describe a set of instructions composed of commands, tasks, and other scripts. These
  instructions may be run in serial, in parallel, or a combination of both.

A configuration file must default-export a function that will be passed a context object that contains
the following keys:

| Key                   | Type       | Description           |
|-----------------------|------------|-----------------------|
| [`command`](#command) | `function` | Create a new command. |
| [`task`](#task)       | `function` | Create a new task.    |
| [`script`](#script)   | `function` | Create a new script.  |

**Example:**

> `nr.config.ts`

```ts
// Using this helper function is optional, but easily enables type-safety and IntelliSense in your
// configuration file.
import defineConfig from '@darkobits/nr';

export default defineConfig({ command, task, script }) => {
  // The first argument to `command` must be the name of the executable to run.
  // The second argument is
  const babelCmd = command('babel', {
    // Arguments are defined as an array of strings and objects. The below
    // will be parsed into `src --out-dir "dist"`.
    args: ['src', { outDir: 'dist' }],
    // This property is optional, but will be needed if we want to reference
    // this command using a string (see below).
    name: 'babel'
  });

  // The first argument to `script` must be the name of the script. We can then
  // reference commands in a script in several different ways:

  // 1. By reference: use the value returned by command directly.
  script('build', [
    babelCmd,
  ]);

  // 2. By name: If the command has defined a name in its options, it can be
  // referenced in a script using a string with the prefix 'cmd:'. To reference
  // a task, use 'task:', and to reference another script, use 'script:'.
  script('build', [
    'cmd:babel'
  ]);

  // 3. Because commands, tasks, and scripts can be passed by value, it is
  // also possible to define them inline in a script's instructions. This
  // approach may be useful when an instruction will only be used by a single
  // script. Furthermore, when a script only contains a single instruction, you
  // do not need to wrap that instruction in an array. This allows simple
  // scripts to become very terse:
  script('build', command('babel', {
    args: ['src', { outDir: 'dist' }]
  }));
};
```

We can then invoke the `build` script thusly:

```
nr build
```

### `command`

| Parameter       | Type                                                | Description                           |
|-----------------|-----------------------------------------------------|---------------------------------------|
| `executable`    | `string`                                            | Name of the executable to run.        |
| `options?`      | [`CommandOptions`](src/etc/types/CommandOptions.ts) | Optional arguments and configuration. |

| Return Type                                     | Description                                                |
|-------------------------------------------------|------------------------------------------------------------|
| [`CommandThunk`](src/etc/types/CommandThunk.ts) | Value that may be provided to `script` to run the command. |

This function accepts an executable name and an options object. The object's `args` property may be used
to specify any [`CommandArguments`](src/etc/types/CommandArguments.ts) to pass to the executable.
[`CommandOptions`](src/etc/types/CommandOptions.ts) also supports a variety of other ways to customize
the invocation of a command.

To reference a command in a script, use either the return value from `command` directly or a string in
the format `cmd:name` where name is the value provided in `options.name`.

Commands are executed using [`execa`](https://github.com/sindresorhus/execa), and `CommandOptions`
supports all valid Execa options.

[`CommandArguments`](src/etc/types/CommandArguments.ts) may take one of four forms:
* `string` for singular positional argument or to list all arguments as a single string
* `Record<string, any>` to list all arguments as flags (key/value pairs)
* `Array<string | Record<string, any>>` to mix positionals and flags.

#### Argument Casing

The vast majority of modern CLIs use kebab-case for named arguments, while idiomatic JavaScript uses
camelCase to define object keys. Therefore, `nr` will by default convert objects keys from camelCase to
kebab-case. However, some CLIs (Such as the TypeScript compiler) use camelCase for named arguments. In
such cases, set the `preserveArgumentCasing` option to `true` in the commands' options.

**Example:**

> `nr.config.ts`

```ts
import nr from '@darkobits/nr';

export default nr({ command, script }) => {
  // Lint the project using ESLint.
  command('eslint', {
    args: ['src', { ext: '.ts,.tsx,.js,.jsx' }]
  });

  // Type-check and emit type declarations for the project.
  command('tsc', {
    args: { emitDeclarationOnly: true },
    // Do not convert flags to kebab-case, which is the default behavior.
    preserveArgumentCasing: true
  });
};
```

#### `command.node`

This function has the same signature as `command`. It can be used to execute a Node script using the
current version of Node. This variant uses [`execaNode`](https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options)
and the options argument supports all `execaNode` options.

---

### `task`

| Parameter | Type                                          | Description          |
|-----------|-----------------------------------------------|----------------------|
| `taskFn`  | [`TaskFn`](src/etc/types/TaskFn.ts)           | Function to execute. |
| `options` | [`TaskOptions`](src/etc/types/TaskOptions.ts) | Task options.        |

| Return Type                               | Description                                             |
|-------------------------------------------|---------------------------------------------------------|
| [`TaskThunk`](src/etc/types/TaskThunk.ts) | Value that may be provided to `script` to run the task. |

This function accepts a function, [`TaskFn`](src/etc/types/TaskFn.ts), and an optional `options` object.
To reference a task in a script, use either the return value from `task` directly or a string in the
format `task:name`.

To reference a task in a script, use either the return value from `task` directly or a string in
the format `task:name` where name is the value provided in `options.name`.

**Example:**

> `nr.config.ts`

```ts
import nr from '@darkobits/nr';

export default nr({ task, script }) => {
  const helloWorldTask = task(() => {
    console.log('Hello world!');
  }, {
    name: 'helloWorld'
  });

  const doneTask = task(() => {
    console.log('Done.');
  }, {
    name: 'done'
  });

  // Just like commands, tasks may be referenced in a script by value (and thus
  // defined inline) or using a string with the prefix 'task:'. The following
  // two examples are functionally equivalent:

  script('myAwesomeScript', [
    helloWorldTask,
    doneTask
  ]);

  script('myAwesomeScript', [
    'task:helloWorld',
    'task:done'
  ])'
};
```

---

### `script`

| Parameter      | Type                                                | Description                                           |
|----------------|-----------------------------------------------------|-------------------------------------------------------|
| `name`         | `string`                                            | Name of the script.                                   |
| `instructions` | [`InstructionSet`](src/etc/types/InstructionSet.ts) | List of other commands, tasks, or scripts to execute. |
| `options?`     | [`ScriptOptions`](src/etc/types/ScriptOptions.ts)   | Optional script configuration.                        |

| Return Type                                   | Description                                               |
|-----------------------------------------------|-----------------------------------------------------------|
| [`ScriptThunk`](src/etc/types/ScriptThunk.ts) | Value that may be provided to `script` to run the script. |

This function accepts a name, an instruction set, and an options object, [`ScriptOptions`](src/etc/types/ScriptOptions.ts).
It will register the script using the provided `name` and return a value. To reference a script in
another script, use either the return value from `script` directly or a string in the format
`script:name`.

If a script contains a single instruction, it does not need to be wrapped in an array.

The second argument must be an array of [`Instruction`](src/etc/types/Instruction.ts) which may be:

* A reference to a command by name using a `string` in the format `cmd:name` or by value using the value
  returned by `command`.
* A reference to a task by name using a `string` in the format `task:name` or by value using the value
  returned by `task`.
* A reference to another script by name using a `string` in the format `script:name` or by value using
  the value returned by `script`.

#### Parallelization

To indicate that a group of [`Instructions`](src/etc/types/Instruction.ts) should be run in parallel,
wrap them in an an additional array. However, no more than one level of array nesting is allowed. If you
need more complex parallelization, define separate, smaller scripts and compose them.

**Example:**

> `nr.config.ts`

```ts
import nr from '@darkobits/nr';

export default nr({ command, task, script }) => {
  command('babel', {
    args: ['src', { outDir: 'dist' }],
    name: 'babel'
  });

  command('eslint', {
    args: ['src'],
    name: 'lint'
  });

  script('test', command('vitest'), {
    description: 'Run unit tests with Vitest.'
  });

  const doneTask = task(() => { console.log('Done!'); });

  script('prepare', [
    // 1. Run these two commands in parallel.
    ['cmd:babel', 'cmd:lint']
    // 2. Then, run this script.
    'script:test',
    // 3. Finally, run this task.
    doneTask
  ], {
    description: 'Build and lint in parallel, then run unit tests.'
  });

  script('test.coverage', [
    // In such cases, the command's "name" is still significant; it is used
    // for error-reporting, and should therefore be descriptive.
    command('vitest', {
      name: 'vitest-coverage',
      args: ['run', { coverage: true }]
    })
  ], {
    description: 'Test the project and generate a coverage report.'
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
use a JSDoc annotation in a JavaScript configuration file:

> `nr.config.js`

```ts
/** @type {import('@darkobits/nr').UserConfigurationFn} */
export default ({ command, task, script }) => {

};
```

If using a TypeScript configuration file, you can use the `satisfies` operator:

> `nr.config.ts`

```ts
import type { UserConfigurationFn } from '@darkobits/nr';

export default (({ command, task, script }) => {
  // Define configuration here.
}) satisfies UserConfigurationFn;
```

Or, `nr` exports a helper which provides type-safety and IntelliSense without requiring a JSDoc or
explicit type annotation.

> `nr.config.js`

```ts
import defineConfig from '@darkobits/nr';

export default defineConfig(({ command, task, script }) => {
  // Define configuration here.
});
```

# Use

Once you have created an `nr.config.(ts|js)` file in your project and registered commands, tasks, and
scripts, you may invoke a registered script using the `nr` CLI:

```
nr test.coverage
```

Or, using a shorthand:

```
nr t.c
```

More on using shorthands below.

## Script Name Matching

`nr` supports a matching feature that allows the user to pass a shorthand for the desired script name.
Script names may be segmented using a dot, and the matcher will match each segment individually.

For example, if we wanted to execute a script named `build.watch`, we could use any of the following:

```
nr build.w
nr bu.wa
nr b.w
```

Additionally, script name matching is case insensitive, so if we had a script named `testScript`, the
query `testscript` would successfully match it.

> 💡 **Protip**
>
> If a provided shorthand matches more than one script, `nr` will ask you to disambiguate by providing
> more characters. What shorthands you will be able to use is therefore dependent on how similarly-named
> your project's scripts are.

## Pre and Post Scripts

Like [NPM package scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts), `nr`
supports pre and post scripts. Once a query from the CLI is matched to a specific script, `nr` will look
for a script named `pre<matchedScriptName>` and `post<matchedScriptName>`. If found, these scripts will
be run before and after the matched script, respectively.

> 💡 **Protip**
>
> Because script name matching is case insensitive, a script named `build` may have pre and post scripts
> named `preBuild` and `postBuild`.

## Discoverability

Discoverability and self-documentation are encouraged with `nr`. While optional, consider leveraging the
`name`, `group`, and `description` options where available when defining commands, tasks, and scripts.
Thoughtfully organizing your scripts and documenting what they do can go a long way in reducing friction
for new contributors.

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
(hopefully) what each one does. Here's an example:

![package-scripts](https://github.com/darkobits/nr/assets/441546/8f43ee46-ac90-47b6-9ac2-ee4330353fb8)

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
