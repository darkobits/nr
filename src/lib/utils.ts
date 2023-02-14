import { EOL } from 'os';

// @ts-expect-error - This package does not have type definitions.
import errno from 'errno';
import npmRunPath from 'npm-run-path';
import readPkgUp from 'read-pkg-up';
import which from 'which';

import type { CallSite } from 'callsites';
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

  const localPackage = readPkgUp.sync();

  const sourcePackage = readPkgUp.sync({ cwd: fileName });
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
      errno.code.ENOENT
    );
  }
}
