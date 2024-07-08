import type {
  Options as ExecaOptions
} from 'execa';
import type log from 'lib/log';

type Primitive = string | number | boolean;

/**
 * Defines how arguments are specified for commands.
 */
export type CommandArguments =
  /**
   * A single primitive may be used if passing only one argument. Or, a string
   * may be used if the user wishes to provide all arguments string.
   */
  | Primitive
  /**
   * An object may be used if the user only needs to provide a collection of
   * named arguments.
   */
  | Record<string, Primitive>
  /**
   * An array containing primitives and objects may be used to represent both
   * positional and named arguments.
   */
  | Array<Primitive | Record<string, Primitive>>;


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
