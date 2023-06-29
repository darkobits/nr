import type { CommandArguments } from 'etc/types/CommandArguments';
import type {
  Options as ExecaOptions,
  NodeOptions as ExecaNodeOptions
} from 'execa';
import type log from 'lib/log';


export interface CommonCommandOptions {
  /**
   * Optional name to use for the command. If omitted, the name of the
   * executable will be used.
   *
   * Beware: If two commands use the same executable, they will overwrite each
   * other in the global command registry. Referencing such a command using the
   * string 'cmd:name' format will reference the last command to be defined. To
   * avoid this, either:
   * 1. Provide distinct names for each command.
   * 2. Use pass-by-value to refer to commands in scripts.
   * 3. Define commands inline in scripts (effectively using pass-by-value).
   *
   * @default anonymous
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
   * Idiomatic JavaScript uses camel-case for object keys, while the vast
   * majority of CLIs accept named arguments in kebab-case. As such, named
   * arguments are converted from camel-case to kebab-case by default. However
   * some CLIs, like the TypeScript compiler, use camel-case flags. To skip the
   * conversion of camel-case keys to kebab-case, this option may be set to
   * `true`.
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
 * Additional options that may be provided to `command`. Accepts all valid execa
 * options as well.
 *
 * See: See: https://github.com/sindresorhus/execa#execafile-arguments-options
 */
export type CommandOptions = CommonCommandOptions & ExecaOptions;


/**
 * Additional options that may be provided to `command.node`. Accepts all valid
 * execa options as well.
 *
 * See: See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
export type CommandOptionsNode = CommonCommandOptions & ExecaNodeOptions;
