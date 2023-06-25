import { EOL } from 'os';
import path from 'path';

import callsites from 'callsites';
import merge from 'deepmerge';
import {
  execa,
  execaNode,
  type Options as ExecaOptions
} from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import * as R from 'ramda';
import yargsUnparser from 'yargs-unparser';

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
  CommandArguments,
  CommandOptions,
  CommandOptionsNode
} from 'etc/types';


/**
 * Map of registered command names to their corresponding descriptors.
 */
export const commands = new Map<string, CommandDescriptor>();


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
 * Provided a CommandArguments list, returns an array of strings representing
 * the "un-parsed" arguments.
 */
function unParseArguments(args: CommandArguments, preserveArgumentCasing?: boolean) {
  ow(args, 'command and arguments', ow.array.maxLength(3));
  ow(args[0], 'command', ow.string);

  if (args.length === 1) {
    return [];
  }

  let positionals: CommandArguments['1'] = [];
  let flags: CommandArguments['2'] = {};

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
  return yargsUnparser(Object.assign(
    {_: positionals},
    preserveArgumentCasing ? flags : kebabCaseKeys(flags)
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
  const cwd = opts?.execaOptions?.cwd?.toString() ?? process.cwd();

  // N.B. This function uses `which`, which requires that the target file have
  // executable permissions set, which is not required here because we are
  // running the script with Node.
  // const resolvedScriptPath = resolveCommand(scriptPath, cwd?.toString());

  const resolvedScriptPath = path.isAbsolute(scriptPath)
    ? scriptPath
    : path.resolve(cwd, scriptPath);

  const cmd = execaNode(resolvedScriptPath, parsedArguments, merge(commonExecaOptions, opts?.execaOptions ?? {}));
  const escapedCommand = getEscapedCommand(undefined, cmd.spawnargs);
  log.verbose(log.prefix(`cmd:${name}`), 'exec:', log.chalk.gray(escapedCommand));
  return cmd;
};


interface CommandBuilderOptions {
  executor: CommandExecutor;
  name: string;
  args: CommandArguments;
  opts: CommandOptions | undefined;
  sourcePackage: string;
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
  const { executor, name, args, opts, sourcePackage } = builderOptions;

  try {
    // Validate name.
    ow(name, 'command name', ow.string);

    // Parse and validate command and arguments.
    const unParsedArguments = unParseArguments(args, opts?.preserveArgumentCasing);
    const [executableName] = args;

    // Validate options.
    ow<Required<CommandOptions>>(opts, ow.optional.object.exactShape({
      prefix: ow.optional.function,
      execaOptions: ow.optional.object,
      preserveArgumentCasing: ow.optional.boolean
    }));

    const commandThunk = async () => {
      try {
        const runTime = log.createTimer();
        const command = executor(name, executableName, unParsedArguments, opts);

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
 * Prints all available commands.
 */
export function printCommandInfo() {
  const allCommands = Array.from(commands.values());

  if (allCommands.length === 0) {
    console.log('No commands have been registered.');
    return;
  }

  const commandSources = R.uniq(R.map(R.path(['sourcePackage']), allCommands));
  const multipleSources = commandSources.length > 1 || !R.includes('local', commandSources);

  console.log(`${EOL}${log.chalk.bold('Available commands:')}${EOL}`);

  // N.B. Ramda broke inference for array member types when using R.forEach in
  // 0.29.0.
  allCommands.forEach(command => {
    const segments: Array<string> = [];
    const executable = command.arguments[0];
    const argumentsString = unParseArguments(command.arguments, command.options?.preserveArgumentCasing).join(' ');

    if (multipleSources) {
      if (command.sourcePackage !== 'unknown') {
        // includes "local", and other third-party packages.
        segments.push(`${log.chalk.green(command.name)} ${log.chalk.gray.dim(`(${command.sourcePackage})`)}`);
      } else {
        // if the source is "unknown", only show the script's name.
        segments.push(`${log.chalk.green(command.name)}`);
      }
    } else {
      segments.push(log.chalk.green(command.name));
    }

    segments.push(`${log.chalk.gray.dim('└─')} ${log.chalk.gray(executable)} ${log.chalk.gray(argumentsString)}`);

    console.log(segments.join(EOL));
  });

  console.log('');
}


/**
 * Creates a `CommandThunk` that executes a command directly using `execa`.
 */
export function command(name: string, args: CommandArguments, opts?: CommandOptions) {
  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

  return commandBuilder({
    executor: executeCommand,
    name,
    args,
    opts,
    sourcePackage
  });
}


/**
 * Creates a `CommandThunk` that executes a command using `execa.node()`.
 */
command.node = (name: string, args: CommandArguments, opts?: CommandOptionsNode) => {
  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

  return commandBuilder({
    executor: executeNodeCommand,
    name,
    args,
    opts,
    sourcePackage
  });
};
