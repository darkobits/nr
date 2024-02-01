import type { Arguments } from 'yargs-unparser';


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
   * If set, will list the names, groups, and descriptions of all commands.
   */
  commands: boolean | undefined;

  /**
   * [Flag]
   *
   * If set, will list the names, groups, and descriptions of all functions.
   */
  functions: boolean | undefined;

  /**
   * [Flag]
   *
   * If set, will list the names, groups, and descriptions of all scripts.
   */
  scripts: boolean | undefined;
}
