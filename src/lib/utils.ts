import { EOL } from 'os';

// @ts-expect-error - This package does not have type definitions.
import errno from 'errno';
import { npmRunPath } from 'npm-run-path';
import { readPackageUpSync } from 'read-pkg-up';
import which from 'which';

import { NR_RED } from 'etc/constants';
import log from 'lib/log';

import type { CallSite } from 'callsites';
import type { ExecaError } from 'execa';


const chalk = log.chalk;


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

  const stackLines = err.stack?.split(EOL);
  if (!stackLines) throw new Error('[parseError] Unable to parse stack of error.', { cause: err });

  const firstStackLine = err.stack?.split(EOL).findIndex(line => line.startsWith('    at'));
  if (firstStackLine === undefined) throw new Error('[parseError] Unable to determine first stack line of error.', { cause: err });

  const message = stackLines.slice(0, firstStackLine).join(EOL).replace(/Error: /, '');
  const stack = stackLines.slice(firstStackLine).join(EOL);

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
    : `"${arg.replaceAll('"', '\\"')}"`);

  return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ').trim();
}


/**
 * Provided a CallSite object, returns the package name from which it
 * originated.
 */
export function getPackageNameFromCallsite(callSite: CallSite | undefined, fallback = 'unknown') {
  if (!callSite) return fallback;

  const fileName = callSite.getFileName();
  if (!fileName) return fallback;

  const localPackage = readPackageUpSync();

  const sourcePackage = readPackageUpSync({ cwd: fileName });
  if (!sourcePackage) return fallback;

  if (localPackage && localPackage.packageJson.name === sourcePackage.packageJson.name) {
    return 'local';
  }

  return sourcePackage.packageJson.name;
  // return fileName;
}


type MapValueType<M> = M extends Map<any, infer V> ? V : never;


/**
 * Performs a case-insensitive lookup in a Map keyed using strings.
 */
export function caseInsensitiveGet<M extends Map<string, any>>(key: string, map: M) {
  const keys = Array.from(map.keys());

  for (const curKey of keys) {
    if (key.toLowerCase() === curKey.toLowerCase()) return map.get(curKey) as MapValueType<M>;
  }
}


/**
 * Uses `which` to attempt to resolve the absolute path to the provided command.
 * Throws an ENOENT system error if the command cannot be found.
 */
export function resolveCommand(cmd: string, cwd = process.cwd()) {
  try {
    return which.sync(cmd, { path: npmRunPath({ cwd }) });
  } catch {
    throw Object.assign(
      new Error(`ENOENT: no such file or directory: '${cmd}'`),
      // Attache 'code', 'description', and 'errno' properties to the error.
      errno.code.ENOENT
    );
  }
}


/**
 * Standard way for scripts, commands, and tasks to generate log prefixes for
 * themselves based on the entity's name.
 */
export function getPrefixedInstructionName(prefix: string, name: string | undefined) {
  if (typeof name !== 'string' || name === '') return `${prefix}:anonymous`;
  return `${prefix}:${name}`;
}


/**
 * Logs a message in the format:
 *
 * ┃ nr <message>
 */
export function heroLog(message: string) {
  const lines = message.split(EOL);
  const prefixedLines = lines.map(line => `${chalk.gray.dim('┃')} ${chalk.bold.hex(NR_RED)('nr')} ${line}`);
  prefixedLines.forEach(line => console.log(line));
}
