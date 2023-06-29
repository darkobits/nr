import type { CommandBuilderOptions } from './CommandBuilderOptions';
import type { ExecaChildProcess } from 'execa';


export interface CommandExecutorOptions extends Omit<CommandBuilderOptions, 'preserveArgumentCasing' | 'prefix'> {
  /**
   * This will be the parsed name of the command; either the command itself or
   * a custom `name` if one was provided.
   */
  name: string;

  /**
   * Prefixed name for the command as computed by the command builder.
   */
  prefixedName: string;

  /**
   * Commands arguments unparsed into an array of strings.
   */
  unParsedArguments: Array<string>;
}


/**
 * Signature of a command executor. Returns an execa invocation using different
 * strategies.
 */
export type CommandExecutor = (options: CommandExecutorOptions) => ExecaChildProcess;
