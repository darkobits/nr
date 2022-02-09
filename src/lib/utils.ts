import { EOL } from 'os';

import type { ExecaError } from 'execa';


/**
 * Use duck-typing to determine if the provided value is an ExecaError.
 */
export function isExecaError(value: any): value is ExecaError {
  return Boolean(value?.command && value?.exitCode);
}


/**
 * Provided an Error, returns its message, stack, and command (if applicable).
 *
 * TODO: If 'command' is not used any more, remove it.
 */
export function parseError<E extends Error>(err: E) {
  let command: string | undefined;

  if (isExecaError(err)) {
    command = err.command?.split(' ')[0];
  }

  const [message, ...stackLines] = err.message.split(EOL);
  const stack = stackLines.join(EOL);

  return {
    message,
    stack,
    command
  };
}


/**
 * From: https://github.com/sindresorhus/execa/blob/main/lib/command.js
 */
export function getEscapedCommand(file: string | undefined, args: Array<string>) {
  const normalizeArgs = (file: string | undefined, args: Array<string> = []) => (!Array.isArray(args)
    ? [file]
    : [file, ...args]);

  const escapeArg = (arg: string | undefined) => (typeof arg !== 'string' || /^[\w.-]+$/.test(arg)
    ? arg
    : `"${arg.replace(/"/g, '\\"')}"`);

  return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');
}
