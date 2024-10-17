import { EOL } from 'node:os'

import callsites from 'callsites'
import ow from 'ow'
import * as R from 'ramda'

import { IS_FUNCTION_THUNK } from 'etc/constants'
import log from 'lib/log'
import { getPackageNameFromCallsite, getPrefixedInstructionName } from 'lib/utils'

import type { SaffronHandlerContext } from '@darkobits/saffron'
import type {
  CLIArguments,
  UserConfigurationExport,
  Fn,
  FnDescriptor,
  FnOptions,
  FnThunk
} from 'etc/types'

const chalk = log.chalk

/**
 * Map of registered function names to their corresponding descriptors.
 */
export const functions = new Map<string, FnDescriptor>()

/**
 * Prints all available functions.
 */
export function printFunctionInfo(context: SaffronHandlerContext<CLIArguments, UserConfigurationExport>) {
  const allFunctions = Array.from(functions.values())

  if (allFunctions.length === 0) {
    log.info('No functions are registered.')
    if (context.configPath) {
      log.info(`Configuration file: ${context.configPath}`)
    } else {
      log.warn('No configuration file found.')
    }
    return
  }

  const functionSources = R.uniq(R.map(R.path(['sourcePackage']), allFunctions))
  const multipleSources = functionSources.length > 1 || !R.includes('local', functionSources)

  console.log(`${EOL}${chalk.bold('Available functions:')}${EOL}`)

  // N.B. Ramda broke inference for array member types when using R.forEach in
  // 0.29.0.
  allFunctions.forEach(({ name, sourcePackage }) => {
    const segments: Array<string> = []

    if (multipleSources) {
      if (sourcePackage !== 'unknown') {
        // includes "local", and other third-party packages.
        segments.push(`${chalk.green(name)} ${chalk.gray.dim(`(${sourcePackage})`)}`)
      } else {
        // if the source is "unknown", only show the script's name.
        segments.push(`${chalk.green(name)}`)
      }
    } else {
      segments.push(chalk.green(name))
    }

    console.log(segments.join(EOL))
  })

  console.log('')
}

/**
 * Provided a name and function, registers a new function and returns a thunk
 * that, when invoked, will call the function.
 */
export function fn(fn: Fn, options: FnOptions = {}) {
  const { name } = options

  try {
    // Validate parameters.
    ow(name, 'function name', ow.optional.string)
    ow(fn, 'function', ow.function)

    const functionDisplayName = name ?? fn.name
    const prefixedName = getPrefixedInstructionName('fn', functionDisplayName)

    // Get the name of the package that defined this function.
    const sourcePackage = getPackageNameFromCallsite(callsites()[1])

    const FnThunk = async () => {
      try {
        const runTime = log.createTimer()
        log.verbose(log.prefix(prefixedName), '•', chalk.cyan('start'))
        await fn()
        log.verbose(log.prefix(prefixedName), '•', chalk.cyan(runTime))
      } catch (err: any) {
        throw new Error(`${prefixedName} failed • ${err.message}`, { cause: err })
      }
    }

    Object.defineProperties(FnThunk, {
      name: { value: name },
      [IS_FUNCTION_THUNK]: { value: true as const }
    })

    const FunctionDescriptor: FnDescriptor = {
      name: prefixedName,
      sourcePackage,
      thunk: FnThunk as FnThunk
    }

    functions.set(prefixedName, FunctionDescriptor)

    return FnThunk as FnThunk
  } catch (err: any) {
    throw new Error(`Unable to create function "${name}": ${err.message}`, { cause: err })
  }
}