import type execa from 'execa';
import type { Arguments } from 'yargs-unparser';

import type { IS_SCRIPT_THUNK, IS_COMMAND_THUNK } from 'etc/constants';
import type { createCommand, createNodeCommand } from 'lib/commands';
import type log from 'lib/log';
import type { createScript } from 'lib/scripts';


// ----- Commands --------------------------------------------------------------

/**
 * Name of the command. Only necessary if this command will be referenced
 * using a string in the `commands` of a Script. Otherwise, the command may be
 * referenced by providing the return value of `createCommand`.
 */
export type CommandName = string;


/**
 * Shape of the second argument passed to `createCommand`. The first item in
 * this array should be the command to execute.
 *
 * If passing only positional arguments, these may be provided as an array of
 * strings in the second position.
 *
 * If passing only flags, this may be provided as an object in the second
 * position.
 *
 * If passing both positional arguments and flags, positionals should be
 * provided in the second position and flags in the third position.
 */
export type CreateCommandArguments =
  // Command only.
  [string] |
  // Command and positional arguments.
  [string, Array<string>] |
  // Command and flags.
  [string, Record<string, any>] |
  // Command, positional arguments, and flags.
  [string, Array<string>, Record<string, any>];


/**
 * Object describing a command. Passed to `createCommand`.
 */
export interface CreateCommandOptions {
  /**
   * Function that will be passed a Chalk instance and should return a string.
   * This string will be used to prefix all output from the command.
   */
  prefix?: (chalk: typeof log.chalk) => string;

  /**
   * Optional options to pass to Execa, which executes the command.
   *
   * See https://github.com/sindresorhus/execa#cwd for a list of available
   * options.
   */
  execaOptions?: execa.Options;

  /**
   * The vast majority of CLIs accept keys in kebab case. However some, like
   * the TypeScript compiler, use camel case flags. To skip the conversion of
   * camel case keys to kebab case, this option may be set to false.
   */
  preserveArguments?: boolean;
}


/**
 * Signature of a command executor. Returns an execa invocation using different
 * strategies.
 */
export type CommandExecutor = (command: string, args: Array<string>, opts?: CreateCommandOptions) => execa.ExecaChildProcess;


/**
 * Function that will execute a command.
 */
export interface CommandThunk {
  (): Promise<void>;
  [IS_COMMAND_THUNK]: boolean;
  [key: string]: any;
}


// ----- Scripts ---------------------------------------------------------------

/**
 * An instruction indicates what a script should do. Scripts may run commands or
 * other scripts. An `Instruction` may therefore be a `string` that exactly
 * matches the `name` of a registered command or script, or the value returned
 * by `createCommand` or `createScript`.
 */
export type Instruction = string | CommandThunk | ScriptThunk;


/**
 * Object describing a script. Passed to `createScript`.
 */
export interface CreateScriptOptions {
  /**
   * Name of the script. A script's name may contain 'segments' delimited by a
   * single dot. When using the CLI to execute a script, the user may provide a
   * shorthand for the full script name that will be matched against each
   * segment in the name.
   *
   * For example, a script named `build.watch` could be run using `nr b.w`.
   */
  // name: string;

  /**
   * Description of what the script does. This will be printed if the --scripts
   * flag is passed, which lists all available scripts and their descriptions.
   */
  description: string;

  /**
   * Optional group to use with the --scripts flag.
   */
  group?: string;

  /**
   * Array of Instructions that this script will run.
   *
   * An inner array may be used to indicate that a set of Instructions should be
   * run in parallel. However, nesting beyond a depth of 2 is not allowed. If
   * you need complex parallelization, define individual scripts and compose
   * them.
   *
   * @example
   *
   * For example, if Commands 'lint', 'babel', 'type-check', and 'cleanup' were
   * registered, and we wanted to run the 'lint' command, then 'babel' and
   * 'type-check' in parallel, followed by the 'cleanup' command, we would
   * express that thusly:
   *
   * commands: [
   *   'lint',
   *   ['babel', 'type-check'],
   *   'cleanup'
   * ]
   *
   * Note: If a script should run a single group of Instructions in parallel,
   * a nested array is still required to indicate parallelization:
   *
   * commands: [
   *   ['lint', 'test', 'build']
   * ]
   */
  run: Array<Instruction | Array<Instruction>>;

  /**
   * Set to `true` to print a script's total run time.
   */
  timing?: boolean;
}


/**
 * A script's configuration consists of all the options provided to
 * `createScript` in addition to its `name`.
 */
export interface ScriptConfiguration extends CreateScriptOptions {
  name: string;
}


/**
 * Function that will execute a script.
 */
export interface ScriptThunk {
  (): Promise<void>;
  [IS_SCRIPT_THUNK]: boolean;
  [key: string]: any;
}


// ----- Configuration ---------------------------------------------------------

/**
 * Object passed to configuration factories.
 */
export interface ConfigurationFactoryArguments {
  createCommand: typeof createCommand;
  createNodeCommand: typeof createNodeCommand;
  createScript: typeof createScript;
}


/**
 * Signature of configuration factory functions.
 */
export type ConfigurationFactory = (o: ConfigurationFactoryArguments) => void | Promise<void>;


// ----- CLI -------------------------------------------------------------------

/**
 * Argv object passed to CLI handlers.
 */
export interface CLIArguments extends Arguments {
  /**
   * [Positional]
   *
   * Name or partial name of the registered script to run.
   */
  script: string;

  /**
   * [Flag]
   *
   * Optional explicit path to the configuration file to use.
   */
  config?: string;

  /**
   * [Flag]
   *
   * If set, will list the names and descriptions of all registered scripts.
   */
  scripts?: boolean;
}
