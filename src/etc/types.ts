import type execa from 'execa';
import type { Arguments } from 'yargs-unparser';

import type { createCommand } from 'lib/commands';
import type { createScript } from 'lib/scripts';


// ----- Commands --------------------------------------------------------------

/**
 * Object describing a command. Passed to `createCommand`.
 */
export interface CreateCommandOptions {
  /**
   * Name of the command. This value is what will be used in script definitions
   * to execute the command.
   */
  name: string;

  /**
   * Name of the executable to run. This may be any executable in $PATH.
   */
  command: string;

  /**
   * Optional arguments to pass to <command>. This object is parsed by
   * `yargs-unparser` and conforms to the Yargs spec for parsed arguments.
   * Positional arguments should be declared using the key "_" whose value
   * should be an array of strings. Flags should be defined as keys in camel
   * case (they will be converted to kebab case, see below) and values should
   * be a primitive (string, number, boolean).
   */
  arguments?: Partial<Arguments>;

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
 * Function that will execute a command.
 */
export type CommandThunk = () => execa.ExecaChildProcess;


// ----- Scripts ---------------------------------------------------------------

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
  name: string;

  /**
   * Description of what the script does. This will be printed if the --scripts
   * flag is passed, which lists all available scripts and their descriptions.
   */
  description: string;

  /**
   * Array of commands that the script will run. Each string must exactly match
   * the name of a registered command. To run commands in parallel, use a nested
   * array of strings.
   *
   * For example, if commands 'lint', 'babel', 'type-check', and 'cleanup' were
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
   * Note that if a script should run a single group of commands in parallel,
   * a nested array is still required to indicate parallelization:
   *
   * commands: [
   *   ['lint', 'test', 'build']
   * ]
   */
  commands: Array<string | Array<string>>;
}


/**
 * Function that will execute a script.
 */
export type ScriptThunk = () => Promise<void>;


// ----- Configuration ---------------------------------------------------------

/**
 * Object passed to configuration factories.
 */
export interface ConfigurationFactoryArguments {
  createCommand: typeof createCommand;
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
