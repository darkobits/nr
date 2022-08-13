
import type { IS_SCRIPT_THUNK, IS_COMMAND_THUNK, IS_TASK_THUNK } from 'etc/constants';
import type { ExecaChildProcess, Options } from 'execa';
import type { command } from 'lib/commands';
import type log from 'lib/log';
import type { script } from 'lib/scripts';
import type { task } from 'lib/tasks';
import type { Arguments } from 'yargs-unparser';


// ----- Commands --------------------------------------------------------------

/**
 * Shape of the array passed as the second argument to `command`.
 *
 * The first member should be the command to execute.
 *
 * If passing only positional arguments, these may be provided as an array of
 * strings as the second member of the array.
 *
 * If passing only flags, these may be provided as an object as the second
 * member of the array.
 *
 * If passing both positional arguments and flags, positionals should be
 * provided as the second member and flags as the third.
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
 * Additional options that may be provided to `command`
 */
export interface CreateCommandOptions {
  /**
   * Function that will be passed a Chalk instance and should return a string.
   * This string will be used to prefix all output from the command.
   */
  prefix?: (chalk: typeof log.chalk) => string;

  /**
   * Optional options to pass to execa, which executes the command.
   *
   * See https://github.com/sindresorhus/execa#cwd for a list of available
   * options.
   */
  execaOptions?: Options;

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
export type CommandExecutor = (name: string, command: string, args: Array<string>, opts?: CreateCommandOptions) => ExecaChildProcess;


/**
 * Return type of `command`.
 */
export interface CommandThunk {
  (): Promise<void>;
  [IS_COMMAND_THUNK]: true;
}


/**
 * Descriptor for a command that will be stored in the registry.
 */
export interface CommandDescriptor {
  name: string;
  sourcePackage: string;
  arguments: CreateCommandArguments;
  options: CreateCommandOptions;
  thunk: CommandThunk;
}


// ----- Tasks -----------------------------------------------------------------

/**
 * Signature of generic user-provided task functions.
 */
export type TaskFn = (...args: Array<any>) => Promise<any> | any;


/**
 * Return type of `task`.
 */
export interface TaskThunk {
  (): Promise<void>;
  [IS_TASK_THUNK]: true;
}


/**
 * Descriptor for a Task that will be stored in the registry.
 */
export interface TaskDescriptor {
  name: string;
  sourcePackage: string;
  thunk: TaskThunk;
}


// ----- Scripts ---------------------------------------------------------------

export type Thunk = ScriptThunk | CommandThunk | TaskThunk;


/**
 * An `Instruction` indicates what a script should do. Scripts may run commands,
 * tasks, or other scripts. An `Instruction` may therefore be:
 *
 * - a `string` in the form `cmd:command-name` to execute a command
 * - a `string` in the form `task:task-name` to execute a task
 * - a `string` in the form `script:script-name` to execute a script
 * - the value returned by `command`, `task`, or `script`
 */
export type Instruction = string | Thunk;


/**
 * An `Instruction` in `string` form will be converted into an object of the
 * following shape.
 */
export interface ParsedInstruction {
  type: 'cmd' | 'task' | 'script';
  name: string;
}


/**
 * Configuration options passed as the second argument to `script`.
 */
export interface CreateScriptOptions {
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
   * Optional description of what the script does. Used when showing available
   * scripts with the --scripts flag.
   */
  description?: string;

  /**
   * Optional group for the script. Used when showing available scripts with the
   * --scripts flag.
   */
  group?: string;

  /**
   * Set to `true` to print a script's total run time once it has finished.
   */
  timing?: boolean;
}


/**
 * Return type of `script`.
 */
export interface ScriptThunk {
  (): Promise<void>;
  [IS_SCRIPT_THUNK]: true;
}


/**
 * Descriptor for a script that will be stored in the registry.
 */
export interface ScriptDescriptor {
  name: string;
  sourcePackage: string;
  options: CreateScriptOptions;
  thunk: ScriptThunk;
}


// ----- Configuration ---------------------------------------------------------

/**
 * Context passed to user configuration functions.
 */
export interface ConfigurationFactoryContext {
  /**
   * Provided a name and a command configuration, registers the command and
   * returns a `CommandThunk`.
   */
  command: typeof command;

  /**
   * Provided a name and a task function, registers the task and returns a
   * `TaskThunk`.
   */
  task: typeof task;

  /**
   * Provided a name and a script configuration, registers the script and
   * returns a `ScriptThunk`.
   */
  script: typeof script;

  /**
   * True if a CI environment has been detected.
   *
   * See: https://github.com/watson/is-ci
   */
  isCI: boolean;
}


/**
 * Signature of configuration factory functions.
 */
export type ConfigurationFactory = (ctx: ConfigurationFactoryContext) => void | Promise<void>;


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
  query: string | undefined;

  /**
   * [Flag]
   *
   * Optional explicit path to the configuration file to use.
   */
  config: string | undefined;

  /**
   * [Flag]
   *
   * If set, will list the names and descriptions of all registered scripts.
   */
  scripts: boolean | undefined;
}


// ----- Miscellaneous ---------------------------------------------------------
