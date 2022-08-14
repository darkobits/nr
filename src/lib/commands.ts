import callsites from 'callsites';
import merge from 'deepmerge';
// @ts-expect-error - This package does not have type definitions.
import errno from 'errno';
import { execa, execaNode,  Options as ExecaOptions } from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import { npmRunPath } from 'npm-run-path';
import which from 'which';
import unParseArgs from 'yargs-unparser';

import { IS_COMMAND_THUNK } from 'etc/constants';
import log, { LogPipe } from 'lib/log';
import ow from 'lib/ow';
import {
  getEscapedCommand,
  getPackageNameFromCallsite
} from 'lib/utils';

import type {
  CommandDescriptor,
  CommandExecutor,
  CommandThunk,
  CreateCommandArguments,
  CreateCommandOptions
} from 'etc/types';


/**
 * Map of registered command names to their corresponding command thunks.
 */
export const commands = new Map<string, CommandDescriptor>();


/**
 * Uses `which` to attempt to resolve the absolute path to the provided command.
 * Throws an ENOENT system error if the command cannot be found.
 */
export function resolveCommand(cmd: string, cwd: string | URL | undefined = process.cwd()) {
  try {
    return which.sync(cmd, { path: npmRunPath({ cwd }) });
  } catch {
    throw Object.assign(new Error(`ENOENT: no such file or directory: '${cmd}'`), errno.code.ENOENT);
  }
}


/**
 * @private
 *
 * Common options provided to Execa.
 */
const commonExecaOptions: ExecaOptions = {
  // Prefer locally-installed versions of executables. For example, this
  // will search in the local NPM bin folder even if the user hasn't
  // added it to their $PATH.
  // TODO: Use npm-run-path here?
  preferLocal: true,
  stdio: 'pipe',
  env: {
    FORCE_COLOR: 'true'
  }
};


/**
 * @private
 *
 * Provided an arguments array, returns an array of strings representing the
 * "un-parsed" arguments.
 */
function parseArguments(args: CreateCommandArguments, preserveArguments?: boolean) {
  ow(args, 'command and arguments', ow.array.maxLength(3));
  ow(args[0], 'command', ow.string);

  if (args.length === 1) {
    return [];
  }

  let positionals: CreateCommandArguments['1'] = [];
  let flags: CreateCommandArguments['2'] = {};


  if (args.length === 2) {
    if (Array.isArray(args[1])) {
      // Got [command, positionals] form.
      ow(args[1], 'positional arguments', ow.array.ofType(ow.string));
      positionals = args[1];
    } else {
      // Got [command, flags] form.
      ow(args[1], 'flags', ow.object);
      flags = args[1];
    }
  } else if (args.length === 3) {
    // Got [command, positionals, flags] form.
    ow(args[1], 'positional arguments', ow.array.ofType(ow.string));
    positionals = args[1];
    ow(args[2], 'flags', ow.object);
    flags = args[2];
  }

  // Convert arguments object to an array of strings, first converting any
  // flags to kebab-case, unless preserveKeys is truthy.
  return unParseArgs(Object.assign(
    {_: positionals},
    preserveArguments ? flags : kebabCaseKeys(flags)
  ));
}


/**
 * @private
 *
 * Executes a command directly using Execa.
 */
const executeCommand: CommandExecutor = (name, executableName, parsedArguments, opts) => {
  const cmd = execa(executableName, parsedArguments, merge(commonExecaOptions, opts?.execaOptions ?? {}));
  const escapedCommand = getEscapedCommand(undefined, cmd.spawnargs);
  log.verbose(log.prefix(`cmd:${name}`), 'exec:', log.chalk.gray(escapedCommand));
  return cmd;
};


/**
 * @private
 *
 * Executes a command using `execaNode`.
 *
 * See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
const executeNodeCommand: CommandExecutor = (name, scriptPath, parsedArguments, opts) => {
  const cwd = opts?.execaOptions?.cwd;
  const resolvedScriptPath = resolveCommand(scriptPath, cwd);
  const cmd = execaNode(resolvedScriptPath, parsedArguments, merge(commonExecaOptions, opts?.execaOptions ?? {}));
  const escapedCommand = getEscapedCommand(undefined, cmd.spawnargs);
  log.verbose(log.prefix(`cmd:${name}`), 'exec:', log.chalk.gray(escapedCommand));
  return cmd;
};


interface CommandBuilderOptions {
  executor: CommandExecutor;
  name: string;
  args: CreateCommandArguments;
  opts: CreateCommandOptions | undefined;
}


/**
 * @private
 *
 * Provided a CommandExecutor, returns a function that, provided a command
 * options object, returns a CommandThunk. The CommandThunk is also added to the
 * command registry.
 *
 * When invoked, the CommandThunk will execute the command using the provided
 * CommandExecutor strategy.
 */
function commandBuilder(builderOptions: CommandBuilderOptions): CommandThunk {
  const { executor, name, args, opts } = builderOptions;

  try {
    // Validate name.
    ow(name, 'command name', ow.string);

    // Parse and validate command and arguments.
    const parsedArguments = parseArguments(args, opts?.preserveArguments);
    const [executableName] = args;

    // Validate options.
    ow<Required<CreateCommandOptions>>(opts, ow.optional.object.exactShape({
      prefix: ow.optional.function,
      execaOptions: ow.optional.object,
      preserveArguments: ow.optional.boolean
    }));

    // Get the name of the package that defined this command.
    const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

    const commandThunk = async () => {
      try {
        const runTime = log.createTimer();
        const command = executor(name, executableName, parsedArguments, opts);

        // If the user provided a custom prefix function, generate it now.
        const prefix = opts?.prefix ? opts.prefix(log.chalk) : '';

        if (command.stdout) {
          command.stdout.pipe(new LogPipe((...args: Array<any>) => {
            console.log(...[prefix, ...args].filter(Boolean));
          }));
        }

        if (command.stderr) {
          command.stderr.pipe(new LogPipe((...args: Array<any>) => {
            console.error(...[prefix, ...args].filter(Boolean));
          }));
        }

        void command.on('exit', code => {
          if (code === 0 || opts?.execaOptions?.reject === false) {
            // If the command exited successfully or if we are ignoring failed
            // commands, log completion time.
            log.verbose(log.prefix(`cmd:${name}`), log.chalk.gray(`Done in ${runTime}.`));
          }
        });

        await command;
      } catch (err: any) {
        throw new Error(`Command "${name}" failed: ${err.message}`);
      }
    };

    Object.defineProperties(commandThunk, {
      name: { value: name },
      [IS_COMMAND_THUNK]: { value: true as const }
    });

    commands.set(name, {
      name,
      sourcePackage,
      arguments: args,
      options: opts,
      thunk: commandThunk as CommandThunk
    });

    return commandThunk as CommandThunk;
  } catch (err: any) {
    console.log(err);
    err.message = `Unable to create command "${name}": ${err.message}`;
    throw err;
  }

}


/**
 * Creates a `CommandThunk` that executes a command directly using `execa`.
 */
export function command(name: string, args: CreateCommandArguments, opts?: CreateCommandOptions) {
  return commandBuilder({
    executor: executeCommand,
    name,
    args,
    opts
  });
}


/**
 * Creates a `CommandThunk` that executes a command using `execa.node()`.
 */
command.node = (name: string, args: CreateCommandArguments, opts?: CreateCommandOptions) => {
  return commandBuilder({
    executor: executeNodeCommand,
    name,
    args,
    opts
  });
};


/**
 * Creates a `CommandThunk` that executes a command using `execa.node()` with
 * `babel-node` as the executable.
 */
command.babel = (...params: Parameters<typeof command.node>) => {
  const [name, args, opts] = params;

  return command.node(name, args, merge({
    execaOptions: {
      nodePath: 'babel-node',
      nodeOptions: ['--extensions', '.ts,.tsx,.js,.jsx,.json']
    }
  }, opts ?? {}));
};
