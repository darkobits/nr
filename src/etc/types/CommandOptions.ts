import type { Options } from 'execa';
import type log from 'lib/log';


/**
 * Additional options that may be provided to `command`.
 */
export interface CommandOptions {
  /**
   * Function that will be passed a Chalk instance and should return a string.
   * This string will be used to prefix all output from the command.
   *
   * See: https://github.com/chalk/chalk
   */
  prefix?: (chalk: typeof log.chalk) => string;

  /**
   * Options to pass to execa, which executes the commands.
   *
   * See: https://github.com/sindresorhus/execa
   */
  execaOptions?: Options;

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
}
