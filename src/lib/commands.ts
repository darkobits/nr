import path from 'path';

import boxen from 'boxen';
import callsites from 'callsites';
import merge from 'deepmerge';
import {
  execa,
  execaNode,
  type Options as ExecaOptions
} from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import ow from 'ow';
import * as R from 'ramda';
import yargsUnparser from 'yargs-unparser';

import { IS_COMMAND_THUNK } from 'etc/constants';
import log, { LogPipe } from 'lib/log';
import {
  getEscapedCommand,
  getPackageNameFromCallsite,
  getPrefixedInstructionName,
  heroLog
} from 'lib/utils';

import type { SaffronHandlerContext } from '@darkobits/saffron';
import type {
  CLIArguments,
  CommandArguments,
  CommandBuilderOptions,
  CommandDescriptor,
  CommandExecutor,
  CommandExecutorOptions,
  CommandOptions,
  CommandOptionsNode,
  CommandThunk,
  ConfigurationFactory
} from 'etc/types';


const chalk = log.chalk;


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


// ----- Utilities -------------------------------------------------------------

/**
 * @private
 *
 * Provided a CommandArguments list, returns an array of strings representing
 * the "un-parsed" arguments.
 */
function unParseArguments(args: CommandArguments | undefined, preserveArgumentCasing?: boolean) {
  if (!args) return [];

  const positionals: Array<string> = [];
  const flags: Record<string, any> = {};

  // Single string form, return without un-parsing, nested in an array.
  if (typeof args === 'string') {
    return [args];
  }

  // Single object form.
  if (typeof args === 'object' && !Array.isArray(args)) {
    return yargsUnparser(
      preserveArgumentCasing ? args : kebabCaseKeys(args)
    );
  }

  // Array form.
  args.forEach(arg => {
    // Add string arguments to positionals array.
    if (ow.isValid(arg, ow.string)) {
      positionals.push(arg);
      return;
    }

    if (ow.isValid(arg, ow.object.plain)) {
      Object.entries(arg).forEach(([key, value]) => {
        flags[key] = value;
      });

      return;
    }

    throw new TypeError(`Expected "argument" to be of type "string" or "object", got "${typeof arg}".`);
  });

  const reCasedFlags = preserveArgumentCasing ? flags : kebabCaseKeys(flags);

  return yargsUnparser({
    _: positionals,
    ...reCasedFlags
  });
}


/**
 * Prints all available commands.
 */
export function printCommandInfo(context: SaffronHandlerContext<CLIArguments, ConfigurationFactory>) {
  const allCommands = Array.from(commands.values());

  if (allCommands.length === 0) {
    log.info('No commands are registered.');
    if (context.configPath) {
      log.info(`Configuration file: ${context.configPath}`);
    } else {
      log.warn('No configuration file found.');
    }
    return;
  }

  const printCommand = (commandDescriptor: CommandDescriptor) => {
    const { executable, name, unParsedArguments, sourcePackage } = commandDescriptor;
    let title = chalk.green.bold(name);

    // Build script name, including package of origin.
    const commandSources = R.uniq(R.map(R.path(['sourcePackage']), allCommands));
    // Hide origin descriptors if all packages are local.
    const hideOriginDescriptors = commandSources.length === 1 && commandSources[0] === 'local';

    if (!hideOriginDescriptors && sourcePackage !== 'unknown') {
      title += sourcePackage === 'local'
        // Scripts from the local package.
        ? ` ${chalk.green.dim('local')}`
        // Scripts from third-party packages.
        : ` ${chalk.green.dim(`via ${sourcePackage}`)}`;
    }

    const finalDescription = log.chalk.gray.dim([
      executable,
      ...unParsedArguments ?? []
    ].join(' '));

    console.log(boxen(finalDescription, {
      title,
      padding: {
        top: 0,
        left: 1,
        right: 1,
        bottom: 0
      },
      margin: 0,
      borderColor: '#242424'
    }));
  };

  console.log('');
  heroLog('• available commands');

  console.log('');
  R.forEach(printCommand, allCommands);

  console.log('');
  heroLog(chalk.gray.dim(`• reference commands in scripts using ${chalk.bold('cmd:name')}.`));
  heroLog(chalk.gray.dim('• see: https://darkobits.gitbook.io/nr/configuration-reference/script'));
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
  const {
    executable,
    executor,
    name,
    args,
    sourcePackage,
    prefix,
    preserveArgumentCasing,
    reject
  } = builderOptions;

  try {
    // Validate command.
    ow(executable, 'executable', ow.string);
    // Validate name.
    ow(name, 'command name', ow.optional.string);

    // Validate other options.
    ow<Required<CommandBuilderOptions>>(builderOptions, ow.optional.object.partialShape({
      executable: ow.string,
      name: ow.optional.string,
      args: ow.optional.any(
        ow.string,
        ow.object.plain,
        ow.array.ofType(ow.any(
          ow.string,
          ow.object.plain
        ))
      ),
      prefix: ow.optional.function,
      preserveArgumentCasing: ow.optional.boolean,
      // These options will be added by executors, the rest come from the user.
      executor: ow.function,
      sourcePackage: ow.string

      // TODO: This will not validate any execa options, which are now part of
      // this object. These will still cause type errors.
    }));

    // This defaults to the `name` provided or otherwise to the name of the
    // executable itself.
    const commandDisplayName = name ?? executable;
    const prefixedName = getPrefixedInstructionName('cmd', commandDisplayName);

    // Parse and validate command and arguments.
    const unParsedArguments = unParseArguments(args, preserveArgumentCasing);

    const commandExecutorOptions: CommandExecutorOptions = {
      ...builderOptions,
      unParsedArguments,
      prefixedName
    };

    const commandThunk = async () => {
      try {
        const runTime = log.createTimer();
        const childProcess = executor(commandExecutorOptions);

        // If the user provided a custom prefix function, generate it now.
        const commandPrefix = prefix ? prefix(chalk) : '';

        if (childProcess.stdout) {
          childProcess.stdout.pipe(new LogPipe((...args: Array<any>) => {
            console.log(...[commandPrefix, ...args].filter(Boolean));
          }));
        }

        if (childProcess.stderr) {
          childProcess.stderr.pipe(new LogPipe((...args: Array<any>) => {
            console.error(...[commandPrefix, ...args].filter(Boolean));
          }));
        }

        void childProcess.on('exit', code => {
          if (code === 0 || reject === false) {
            // If the command exited successfully or if we are ignoring failed
            // commands, log completion time.
            log.verbose(log.prefix(prefixedName), '•', chalk.gray(runTime));
          }
        });

        // log.verbose(
        //   log.prefix(prefixedName),
        //   '•',
        //   chalk.gray(getEscapedCommand(executable, childProcess.spawnargs))
        // );

        await childProcess;
      } catch (err: any) {
        throw new Error(`${prefixedName} failed • ${err.message}`, { cause: err });
      }
    };

    Object.defineProperties(commandThunk, {
      name: { value: name },
      [IS_COMMAND_THUNK]: { value: true as const }
    });

    const commandDescriptor: CommandDescriptor = {
      ...builderOptions,
      name: commandDisplayName,
      sourcePackage,
      unParsedArguments,
      thunk: commandThunk as CommandThunk
    };

    commands.set(commandDisplayName, commandDescriptor);

    return commandThunk as CommandThunk;
  } catch (cause: any) {
    throw new Error(`Unable to create command "${name}": ${cause.message}`, { cause });
  }

}


// ----- Command Executors -----------------------------------------------------

// These functions accept a `CommandExecutorOptions` and execute the described
// command using different strategies.


/**
 * @private
 *
 * Executes a command directly using Execa.
 */
const executeCommand: CommandExecutor = (options: CommandExecutorOptions) => {
  const { executable, prefixedName, unParsedArguments } = options;

  // Print the exact command we are about to run.
  log.verbose(
    log.prefix(prefixedName),
    '•',
    chalk.gray(getEscapedCommand(executable, unParsedArguments))
  );

  return execa(executable, unParsedArguments, merge(commonExecaOptions, options ?? {}));
};


/**
 * @private
 *
 * Executes a command using `execaNode`.
 *
 * See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
const executeNodeCommand: CommandExecutor = (options: CommandExecutorOptions) => {
  const { executable, prefixedName, unParsedArguments } = options;

  const cwd = options?.cwd?.toString() ?? process.cwd();

  // N.B. This function uses `which`, which requires that the target file have
  // executable permissions set, which is not required here because we are
  // running the script with Node.
  // const resolvedScriptPath = resolveCommand(scriptPath, cwd?.toString());
  const resolvedScriptPath = path.isAbsolute(executable)
    ? executable
    : path.resolve(cwd, executable);

  // Print the exact command we are about to run.
  log.verbose(
    log.prefix(prefixedName),
    '•',
    chalk.gray('node'),
    chalk.gray(getEscapedCommand(executable, unParsedArguments))
  );

  return execaNode(resolvedScriptPath, unParsedArguments, merge(commonExecaOptions, options ?? {}));
};


// ----- Command Types ---------------------------------------------------------

// These functions gather all parameters for a command, including a
// `CommandOptions` object, determine source package, and create a
// `CommandBuilderOptions` object that is passed to `commandBuilder` where
// further common validation logic and processing occurs.


/**
 * Creates a `CommandThunk` that executes a command directly using `execa`.
 */
export function command(executable: string, opts: CommandOptions = {}) {
  ow(executable, 'first argument', ow.string);

  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

  return commandBuilder({
    executable,
    executor: executeCommand,
    sourcePackage,
    ...opts
  });
}


/**
 * Creates a `CommandThunk` that executes a command using `execaNode()`.
 *
 * See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
command.node = (executable: string, opts: CommandOptionsNode = {}) => {
  ow(executable, 'first argument', ow.string);

  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

  return commandBuilder({
    executable,
    executor: executeNodeCommand,
    sourcePackage,
    ...opts
  });
};
