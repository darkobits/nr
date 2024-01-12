import type { Options as ExecaOptions, NodeOptions as ExecaNodeOptions } from 'execa';
import type log from 'lib/log';


/**
 * Defines how arguments are specified for commands.
 */
export type CommandArguments =
  /**
   * A string may be used if passing only a single argument, or if the user
   * wishes to provide all positional arguments and flags as a string.
   */
  | string
  /**
   * An object may be used if the user only needs to provide a set of named
   * arguments.
   */
  | Record<string, any>
  /**
   * An array containing strings and objects may be used to represent a mixture
   * of positionals and named arguments.
   */
  | Array<string | Record<string, any>>;


export interface CommonCommandOptions {
  /**
   * Descriptive name to use for the command. This is required to allow the
   * command to be referenced using a string token and will be used for error
   * reporting.
   */
  name?: string;

  /**
   * Optional arguments to pass to the command.
   */
  args?: CommandArguments;

  /**
   * Function that will be passed a Chalk instance and should return a string.
   * This string will be used to prefix all output from the command.
   *
   * See: https://github.com/chalk/chalk
   */
  prefix?: (chalk: typeof log.chalk) => string;

  /**
   * Set this option to `true` to disable the default behavior of converting
   * camelCase object keys provided in `CommandArguments` to kebab-case.
   *
   * @default false
   */
  preserveArgumentCasing?: boolean;

  /**
   * Set to `true` to print a commands's total run time once it has finished.
   *
   * @default false
   */
  timing?: boolean;
}


/**
 * Options that may be provided to `command`. Accepts all `CommonCommandOptions`
 * and all Execa options.
 *
 * See: See: https://github.com/sindresorhus/execa#execafile-arguments-options
 */
export type CommandOptions = CommonCommandOptions & ExecaOptions;


/**
 * Options that may be provided to `command.node`. Accepts all
 * `CommonCommandOptions` and all ExecaNode options.
 *
 * See: See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
export type CommandOptionsNode = CommonCommandOptions & ExecaNodeOptions;
