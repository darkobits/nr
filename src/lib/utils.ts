import { EOL } from 'node:os'

import { readPackageUpSync } from 'read-package-up'

import { NR_RED } from 'etc/constants'
import log from 'lib/log'

import type { CallSite } from 'callsites'

const chalk = log.chalk

/**
 * Provided an Error, returns its message, stack, and command (if applicable).
 */
export function parseError<E extends Error>(err: E) {
  const stackLines = err.stack?.split(EOL)
  if (!stackLines) throw new Error('[parseError] Unable to parse stack of error.', { cause: err })

  const firstStackLine = err.stack?.split(EOL).findIndex(line => line.startsWith('    at'))
  if (firstStackLine === undefined) throw new Error('[parseError] Unable to determine first stack line of error.', { cause: err })

  const message = stackLines.slice(0, firstStackLine).join(EOL).replace(/Error: /, '')
  const stack = stackLines.slice(firstStackLine).join(EOL)

  return { message, stack }
}

/**
 * From: https://github.com/sindresorhus/execa/blob/main/lib/command.js
 */
export function getEscapedCommand(file: string | undefined, args: Array<string>) {
  const normalizeArgs = (file: string | undefined, args: Array<string> = []) => (!Array.isArray(args)
    ? [file]
    : [file, ...args])

  const escapeArg = (arg: string | undefined) => (typeof arg !== 'string' || /^[\w.-]+$/.test(arg)
    ? arg
    : `"${arg.replaceAll('"', String.raw`\"`)}"`)

  return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ').trim()
}

/**
 * Provided a CallSite object, returns the package name from which it
 * originated.
 */
export function getPackageNameFromCallsite(callSite: CallSite | undefined, fallback = 'unknown') {
  if (!callSite) return fallback

  const fileName = callSite.getFileName()
  if (!fileName) return fallback

  const localPackage = readPackageUpSync()

  // getFileName returns a string in the format file://, so we either need to
  // strip this from the beginning of the string or use it to create an actual
  // URL instance to provide to readPackageUp. The latter seems less error-prone
  const sourcePackage = readPackageUpSync({ cwd: new URL(fileName) })
  if (!sourcePackage) return fallback

  if (localPackage && localPackage.packageJson.name === sourcePackage.packageJson.name) {
    return 'local'
  }

  return sourcePackage.packageJson.name
  // return fileName;
}

/**
 * Performs a case-insensitive lookup in a Map keyed using strings.
*/
export function caseInsensitiveGet<M extends Map<string, any>>(key: string, map: M) {
  const keys = Array.from(map.keys())
  type MapValueType<M> = M extends Map<any, infer V> ? V : never;

  for (const curKey of keys) {
    if (key.toLowerCase() === curKey.toLowerCase()) return map.get(curKey) as MapValueType<M>
  }
}

/**
 * Standard way for scripts, commands, and functions to generate log prefixes
 * for themselves based on the entity's name.
 */
export function getPrefixedInstructionName(prefix: string, name: string | undefined) {
  if (typeof name !== 'string' || name === '') return `${prefix}:anonymous`
  return `${prefix}:${name}`
}

/**
 * Logs a message in the format:
 *
 * ┃ nr <message>
 */
export function heroLog(message: string) {
  const lines = message.split(EOL)
  const prefixedLines = lines.map(line => `${chalk.gray.dim('┃')} ${chalk.bold.hex(NR_RED)('nr')} ${line}`)
  prefixedLines.forEach(line => console.log(line))
}