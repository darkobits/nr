import type { CommandOptions } from './CommandOptions';
import type { ExecaChildProcess } from 'execa';


/**
 * Signature of a command executor. Returns an execa invocation using different
 * strategies.
 */
export type CommandExecutor = (
  name: string,
  command: string,
  args: Array<string>,
  opts?: CommandOptions
) => ExecaChildProcess;
