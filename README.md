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
  - [`fn`](#fn)
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

A configuration file is responsible for creating **commands**, **functions**, and **scripts**:

- **Commands** describe the invocation of a single executable and any arguments provided to it, as well
  as any configuration related to how the command will run, such as environment variables and how STDIN
  and STDOUT will be handled.
- **Functions** are JavaScript functions that may execute arbitrary code. They may be synchronous or
  asynchronous. Functions can be used to interface with another application's [Node API](https://vitejs.dev/guide/api-javascript),
  or to perform any in-process work that does not rely on the invocation of an external CLI.
- **Scripts** describe a set of instructions composed of commands, functions, and other scripts. These
  instructions may be run in serial, in parallel, or a combination of both.

A configuration file must default-export a function that will be passed a context object that contains
the following keys:

| Key                   | Type       | Description            |
|-----------------------|------------|------------------------|
| [`command`](#command) | `function` | Create a new command.  |
| [`fn`](#fn)           | `function` | Create a new function. |
| [`script`](#script)   | `function` | Create a new script.   |

**Example:**

> `nr.config.ts`

```ts
export default ({ command, fn, script }) => {
  script('build', [
    command('babel', { args: ['src', { outDir: 'dist' }] }),
    command('eslint', { args: 'src' })
  ]);
};
```

We can then invoke the `build` script thusly:

```
nr build
```

The next sections detail how to create and compose commands, functions, and scripts.

### `command`

| Parameter       | Type                                                | Description                           |
|-----------------|-----------------------------------------------------|---------------------------------------|
| `executable`    | `string`                                            | Name of the executable to run.        |
| `options?`      | [`CommandOptions`](src/etc/types/CommandOptions.ts) | Optional arguments and configuration. |

| Return Type                                     | Description                                                |
|-------------------------------------------------|------------------------------------------------------------|
| [`CommandThunk`](src/etc/types/CommandThunk.ts) | Value that may be provided to `script` to run the command. |

This function accepts an executable name and an options object. The object's `args` property may be used
to specify any [`CommandArguments`](src/etc/types/CommandOptions.ts) to pass to the executable.
[`CommandOptions`](src/etc/types/CommandOptions.ts) also supports a variety of ways to customize the
invocation of a command.

Commands are executed using [`execa`](https://github.com/sindresorhus/execa), and `CommandOptions`
supports all valid Execa options.

To reference a command in a script, use either the return value from `command` or a string in the
format `cmd:name` where name is the value provided in `options.name`.

Assuming the type `Primitive` refers to the union of `string | number | boolean`, [`CommandArguments`](src/etc/types/CommandOptions.ts)
may take one the following three forms:

* `Primitive` to pass a singular positional argument or to list all arguments as a string.
* `Record<string, Primitive>` to provide named arguments only
* `Array<Primitive | Record<string, Primitive>>` to mix positional and named arguments

Each of these forms is documented in the example below.

#### Argument Casing

The vast majority of modern CLIs use kebab-case for named arguments, while idiomatic JavaScript uses
camelCase to define object keys. Therefore, `nr` will by default convert objects keys from camelCase to
kebab-case. However, some CLIs (Such as the TypeScript compiler) use camelCase for named arguments. In
such cases, set the `preserveArgumentCasing` option to `true` in the commands' options.

**Example:**

> `nr.config.ts`

```ts
import defineConfig from '@darkobits/nr';

export default defineConfig(({ command }) => {
  // Examples using single primitive arguments.
  command('echo', { args: 'Hello world!' });
  command('sleep', { args: 5 });

  // Example using a single object of named arguments and disabling
  // conversion to kebab-case.
  command('tsc', {
    args: { emitDeclarationOnly: true },
    preserveArgumentCasing: true
  });

  // Example using a mix of positional and named arguments.
  command('eslint', {
    args: ['src', { ext: '.ts,.tsx,.js,.jsx' }]
  });

  // Execa's default configuration for stdio is 'pipe'. To support interactivity
  // when using Vitest in watch mode, we can easily set stdio to 'inherit' in
  // our options.
  command('vitest', {
    stdio: 'inherit'
  });
});
```

#### `command.node`

This function has the same signature as `command`. It can be used to execute a Node script using the
current version of Node installed on the system. This variant uses [`execaNode`](https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options)
and the options argument supports all `execaNode` options.

---

### `fn`

| Parameter  | Type                                      | Description          |
|------------|-------------------------------------------|----------------------|
| `userFn`   | [`Fn`](src/etc/types/Fn.ts)               | Function to execute. |
| `options?` | [`FnOptions`](src/etc/types/FnOptions.ts) | Function options.    |

| Return Type                           | Description                                                 |
|---------------------------------------|-------------------------------------------------------------|
| [`FnThunk`](src/etc/types/FnThunk.ts) | Value that may be provided to `script` to run the function. |

This function accepts a function, [`Fn`](src/etc/types/Fn.ts), and an optional `options` object.

To reference a function in a script, use either the return value from `fn` directly or a string in the
format `fn:name` where name is the value provided in `options.name`.

**Example:**

> `nr.config.ts`

```ts
import defineConfig from '@darkobits/nr';

export default defineConfig(({ fn, script }) => {
  const helloWorldFn = fn(() => {
    console.log('Hello world!');
  }, {
    name: 'helloWorld'
  });

  const doneFn = fn(() => {
    console.log('Done.');
  }, {
    name: 'done'
  });

  // Just like commands, functions may be referenced in a script by value (and
  // thus defined inline) or using a string with the prefix 'fn:'. The following
  // two examples are therefore equivalent:

  script('myAwesomeScript', [
    helloWorldFn,
    doneFn
  ]);

  script('myAwesomeScript', [
    'fn:helloWorld',
    'fn:done'
  ]);
});
```

---

### `script`

| Parameter      | Type                                              | Description                                               |
|----------------|---------------------------------------------------|-----------------------------------------------------------|
| `name`         | `string`                                          | Name of the script.                                       |
| `instructions` | [`InstructionSet`](src/etc/types/Instruction.ts)  | List of other commands, functions, or scripts to execute. |
| `options?`     | [`ScriptOptions`](src/etc/types/ScriptOptions.ts) | Optional script configuration.                            |

| Return Type                                   | Description                                               |
|-----------------------------------------------|-----------------------------------------------------------|
| [`ScriptThunk`](src/etc/types/ScriptThunk.ts) | Value that may be provided to `script` to run the script. |

This function accepts a name, an instruction set, and an options object, [`ScriptOptions`](src/etc/types/ScriptOptions.ts).
It will register the script using the provided `name` and return a value.

To reference a script in another script, use either the return value from `script` directly or a string
in the format `script:name`.

The second argument may be an array of [`Instruction`](src/etc/types/Instruction.ts) whose elements may
consist of:

* A reference to a command by name using a `string` in the format `cmd:name` or by value using the value
  returned by `command`.
* A reference to a function by name using a `string` in the format `fn:name` or by value using the value
  returned by `fn`.
* A reference to another script by name using a `string` in the format `script:name` or by value using
  the value returned by `script`.

However, if a script contains only a single instruction, it does not need to be wrapped in an array.

#### Parallelization

To indicate that a group of [`Instructions`](src/etc/types/Instruction.ts) should be run in parallel,
wrap them in an an additional array. However, no more than one level of array nesting is allowed. If you
need more complex parallelization, define separate, smaller scripts and compose them.

**Example:**

> `nr.config.ts`

```ts
import defineConfig from '@darkobits/nr';

export default defineConfig(({ command, fn, script }) => {
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

  const doneFn = fn(() => console.log('Done!'));

  script('prepare', [
    // 1. Run these two commands in parallel.
    ['cmd:babel', 'cmd:lint']
    // 2. Then, run this script.
    'script:test',
    // 3. Finally, run this function.
    doneFn
  ], {
    description: 'Build and lint in parallel, then run unit tests.'
  });

  script('test.coverage', [
    command('vitest', {
      args: ['run', { coverage: true }]
    })
  ], {
    description: 'Run unit tests and generate a coverage report.'
  });
});
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

> `nr.config.ts`

```ts
/** @type { import('@darkobits/nr').UserConfigurationExport } */
export default ({ command, fn, script }) => {

};
```

If using a TypeScript configuration file, you can use the `satisfies` operator:

> `nr.config.ts`

```ts
import type { UserConfigurationExport } from '@darkobits/nr';

export default (({ command, fn, script }) => {
  // Define configuration here.
}) satisfies UserConfigurationExport;
```

Or, `nr` exports a helper which provides type-safety and IntelliSense without requiring a JSDoc or
explicit type annotation.

> `nr.config.ts`

```ts
import defineConfig from '@darkobits/nr';

export default defineConfig(({ command, fn, script }) => {
  // Define configuration here.
});
```

# Use

Once you have created an `nr.config.(ts|js)` file in your project and registered commands, functions,
and scripts, you may invoke a registered script using the `nr` CLI:

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
`name`, `group`, and `description` options where available when defining commands, functions, and
scripts. Thoughtfully organizing your scripts and documenting what they do can go a long way in reducing
friction for new contributors.

The `--commands`, `--functions`, and `--scripts` flags may be passed to list information about all known
entities of that type. If `nr` detects that a command, function, or script was registered from a
third-party package, it will indicate the name of the package that created it.

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
