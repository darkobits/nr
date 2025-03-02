import path from 'node:path'

import adeiu from '@darkobits/adeiu'
import boxen from 'boxen'
import callsites from 'callsites'
import merge from 'deepmerge'
import {
  execa,
  execaNode,
  ExecaError,
  type Options as ExecaOptions,
  type Result as ExecaResult
} from 'execa'
import kebabCaseKeys from 'kebabcase-keys'
import ow from 'ow'
import * as R from 'ramda'
import yargsUnparser from 'yargs-unparser'

import { IS_COMMAND_THUNK } from 'etc/constants'
import log from 'lib/log'
import { LogPipe } from 'lib/log-pipe'
import {
  getEscapedCommand,
  getPackageNameFromCallsite,
  getPrefixedInstructionName,
  exitCodeToSignal,
  heroLog
} from 'lib/utils'

import type { SaffronHandlerContext } from '@darkobits/saffron'
import type {
  CLIArguments,
  CommandArguments,
  CommandBuilderOptions,
  CommandDescriptor,
  CommandExecutor,
  CommandExecutorOptions,
  CommandOptions,
  CommandThunk,
  UserConfigurationExport
} from 'etc/types'

const chalk = log.chalk

/**
 * Map of registered command names to their corresponding descriptors.
 */
export const commands = new Map<string, CommandDescriptor>()

/**
 * @private
 *
 * Common options provided to Execa.
 */
const commonExecaOptions: ExecaOptions = {
  // Prefer locally-installed versions of executables. For example, this
  // will search in the local NPM bin folder even if the user hasn't
  // added it to their $PATH.
  // TODO: Use npm-run-path here?
  preferLocal: true,
  stdio: 'pipe',
  env: {
    FORCE_COLOR: 'true'
  }
}

// ----- Utilities -------------------------------------------------------------

/**
 * @private
 *
 * Provided a CommandArguments value, returns an array of strings representing
 * the "un-parsed" arguments to be passed to an executable.
 */
function unParseArguments(args: CommandArguments | undefined, preserveArgumentCasing?: boolean): Array<string> {
  if (!args) return []

  const positionalArguments: Array<string> = []
  const namedArguments: Record<string, any> = {}

  // Single primitive form, cast the primitive as a string and nest in an array.
  if (typeof args === 'string' || typeof args === 'number' || typeof args === 'boolean') {
    return [String(args)]
  }

  // Single object form.
  if (typeof args === 'object' && !Array.isArray(args)) {
    Object.entries(args).forEach(([key, value]) => {
      namedArguments[key] = value
    })
  }

  // Array form.
  if (Array.isArray(args)) {
    args.forEach(arg => {
      // Current item is a primitive, cast to string and add to positionals.
      if (ow.isValid(arg, ow.any(ow.string, ow.number, ow.boolean))) {
        positionalArguments.push(String(arg))
        return
      }

      // Current item is an object representing one or more named arguments. Add
      // each to the
      if (ow.isValid(arg, ow.object.plain)) {
        Object.entries(arg).forEach(([key, value]) => {
          namedArguments[key] = value
        })

        return
      }

      throw new TypeError(`Expected "argument" to be of type "string" or "object", got "${typeof arg}".`)
    })
  }

  const reCasedNamedArguments = preserveArgumentCasing ? namedArguments : kebabCaseKeys(namedArguments)

  return yargsUnparser({
    _: positionalArguments,
    ...reCasedNamedArguments
  })
}

/**
 * Prints all available commands.
 */
export function printCommandInfo(context: SaffronHandlerContext<CLIArguments, UserConfigurationExport>) {
  const allCommands = Array.from(commands.values())

  if (allCommands.length === 0) {
    log.info('No commands are registered.')
    if (context.configPath) {
      log.info(`Configuration file: ${context.configPath}`)
    } else {
      log.warn('No configuration file found.')
    }
    return
  }

  const printCommand = (commandDescriptor: CommandDescriptor) => {
    const { executable, name, unParsedArguments, sourcePackage } = commandDescriptor
    let title = chalk.green.bold(name)

    // Build script name, including package of origin.
    const commandSources = R.uniq(R.map(R.path(['sourcePackage']), allCommands))
    // Hide origin descriptors if all packages are local.
    const hideOriginDescriptors = commandSources.length === 1 && commandSources[0] === 'local'

    if (!hideOriginDescriptors && sourcePackage !== 'unknown') {
      title += sourcePackage === 'local'
        // Scripts from the local package.
        ? ` ${chalk.green.dim('local')}`
        // Scripts from third-party packages.
        : ` ${chalk.green.dim(`via ${sourcePackage}`)}`
    }

    const finalDescription = log.chalk.gray.dim([
      executable,
      ...unParsedArguments ?? []
    ].join(' '))

    console.log(boxen(finalDescription, {
      title,
      padding: {
        top: 0,
        left: 1,
        right: 1,
        bottom: 0
      },
      // Makes the box full-width, auto height.
      fullscreen: width => [width, 0],
      margin: 0,
      borderColor: '#242424'
    }))
  }

  console.log('')
  heroLog('• available commands')

  console.log('')
  R.forEach(printCommand, allCommands)

  console.log('')
  heroLog(chalk.gray.dim(`• reference commands in scripts using ${chalk.bold('cmd:name')}.`))
  heroLog(chalk.gray.dim('• see: https://darkobits.gitbook.io/nr/configuration-reference/script'))
}

/**
 * @private
 *
 * Provided a CommandExecutor, returns a function that, provided a command
 * options object, returns a CommandThunk. The CommandThunk is also added to the
 * command registry.
 *
 * When invoked, the CommandThunk will execute the command using the provided
 * CommandExecutor strategy.
 */
function commandBuilder(builderOptions: CommandBuilderOptions): CommandThunk {
  const {
    executable,
    executor,
    name,
    args,
    sourcePackage,
    prefix,
    preserveArgumentCasing,
    reject
  } = builderOptions

  try {
    // Validate command.
    ow(executable, 'executable', ow.string)
    // Validate name.
    ow(name, 'command name', ow.optional.string)

    // Validate other options.
    ow(builderOptions, ow.optional.object.partialShape({
      executable: ow.string,
      name: ow.optional.string,
      args: ow.optional.any(
        ow.string,
        ow.number,
        ow.boolean,
        ow.object.valuesOfType(
          ow.any(
            ow.string,
            ow.number,
            ow.boolean
          )
        ),
        ow.array.ofType(ow.any(
          ow.string,
          ow.number,
          ow.boolean,
          ow.object.valuesOfType(
            ow.any(
              ow.string,
              ow.number,
              ow.boolean
            )
          )
        ))
      ),
      prefix: ow.optional.function,
      preserveArgumentCasing: ow.optional.boolean,
      // These options will be added by executors, the rest come from the user.
      executor: ow.function,
      sourcePackage: ow.string

      // TODO: This will not validate any execa options, which are now part of
      // this object. These will still cause type errors.
    }))

    // This defaults to the `name` provided or otherwise to the name of the
    // executable itself.
    const commandDisplayName = name ?? executable
    const prefixedName = getPrefixedInstructionName('cmd', commandDisplayName)

    // Parse and validate command and arguments.
    const unParsedArguments = unParseArguments(args, preserveArgumentCasing)

    // Merge provided options onto default Execa options.
    const commandExecutorOptions = merge(commonExecaOptions, {
      ...builderOptions,
      unParsedArguments,
      prefixedName
    })

    // If the user provided any of `stdin`, `stdout`, or `stderr` options,
    // remove our default `stdio` option. Failing to do so will cause Execa to
    // fail.
    if (!R.isEmpty(R.intersection(['stdin', 'stdout', 'stderr'], R.keys(commandExecutorOptions)))) {
      Reflect.deleteProperty(commandExecutorOptions, 'stdio')
    }

    const commandThunk = async () => {
      let unregisterSignalHandler: ReturnType<typeof adeiu> | undefined

      try {
        const runTime = log.chronograph()
        const childProcess = executor(commandExecutorOptions)

        // If the user provided a custom prefix function, generate it now.
        const commandPrefix = prefix ? prefix(chalk) : ''

        // Register a POSIX signal handler that will forward signals to this
        // child process (if necessary) and wait for it to exit.
        adeiu(signal => {
          const { pid } = childProcess

          if (commandExecutorOptions.stdin === 'inherit' || commandExecutorOptions.stdio === 'inherit') {
            log.verbose(`Signal ${chalk.green(signal)} sent to process ${chalk.yellow(pid)} via shared input stream.`)
          } else {
            log.verbose(`Sending signal ${chalk.green(signal)} to process ${chalk.yellow(pid)}.`)
            childProcess.kill(signal)
          }
        })

        if (childProcess.stdout) {
          childProcess.stdout.pipe(new LogPipe((...args: Array<any>) => {
            console.log(...[commandPrefix, ...args].filter(Boolean))
          }))
        }

        if (childProcess.stderr) {
          childProcess.stderr.pipe(new LogPipe((...args: Array<any>) => {
            console.error(...[commandPrefix, ...args].filter(Boolean))
          }))
        }

        childProcess.on('exit', code => {
          if (code === 0 || reject === false) {
            // If the command exited successfully or if we are ignoring failed
            // commands, log completion time.
            log.verbose(log.chalk.dim.cyan(prefixedName), '•', chalk.gray(runTime))
          }
        })

        // log.verbose(
        //   log.chalk.dim.cyan(prefixedName),
        //   '•',
        //   chalk.gray(getEscapedCommand(executable, childProcess.spawnargs))
        // );

        return await childProcess
      } catch (err: any) {
        // By default, Execa will throw when a process exits with any non-zero
        // code. However, signal-related exits should not be considered a
        // failure.
        if (err instanceof ExecaError && (
          // For some signals, Execa will set this flag.
          err.isTerminated ||
          // Otherwise, check if the exit code corresponds to a known signal.
          // R.includes(err.exitCode, R.values(SIGNALS))
          exitCodeToSignal(err.exitCode)
        )) {
          // Execa errors extend from Execa results, so we can actually just
          // return the error here and it will contain all the same properties
          // that a successful result would.
          return err as ExecaResult
        }

        throw new Error(`${prefixedName} failed • ${err.message}`, { cause: err })
      } finally {
        unregisterSignalHandler?.()
      }
    }

    Object.defineProperties(commandThunk, {
      name: { value: name },
      [IS_COMMAND_THUNK]: { value: true as const }
    })

    const commandDescriptor: CommandDescriptor = {
      ...builderOptions,
      name: commandDisplayName,
      sourcePackage,
      unParsedArguments,
      thunk: commandThunk as CommandThunk
    }

    commands.set(commandDisplayName, commandDescriptor)

    return commandThunk as CommandThunk
  } catch (cause: any) {
    throw new Error(`Unable to create command "${name}": ${cause.message}`, { cause })
  }

}

// ----- Command Executors -----------------------------------------------------

// These functions accept a `CommandExecutorOptions` and execute the described
// command using different strategies.

/**
 * @private
 *
 * Executes a command directly using Execa.
 */
const executeCommand: CommandExecutor = (options: CommandExecutorOptions) => {
  const { executable, prefixedName, unParsedArguments } = options

  // Print the exact command we are about to run.
  log.verbose(
    log.chalk.dim.cyan(prefixedName),
    '•',
    chalk.gray(getEscapedCommand(executable, unParsedArguments))
  )

  return execa(executable, unParsedArguments, options)
}

/**
 * @private
 *
 * Executes a command using `execaNode`.
 *
 * See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
const executeNodeCommand: CommandExecutor = (options: CommandExecutorOptions) => {
  const { executable, prefixedName, unParsedArguments } = options

  const cwd = options?.cwd?.toString() ?? process.cwd()

  const resolvedScriptPath = path.isAbsolute(executable)
    ? executable
    : path.resolve(cwd, executable)

  // Print the exact command we are about to run.
  log.verbose(
    log.chalk.dim.cyan(prefixedName),
    '•',
    chalk.gray('node'),
    chalk.gray(getEscapedCommand(executable, unParsedArguments))
  )

  return execaNode(resolvedScriptPath, unParsedArguments, options)
}

// ----- Command Types ---------------------------------------------------------

// These functions gather all parameters for a command, including a
// `CommandOptions` object, determine source package, and create a
// `CommandBuilderOptions` object that is passed to `commandBuilder` where
// further common validation logic and processing occurs.

/**
 * Creates a `CommandThunk` that executes a command directly using `execa`.
 */
export function command(executable: string, opts: CommandOptions = {}) {
  ow(executable, 'executable', ow.string)

  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1])

  return commandBuilder({
    executable,
    executor: executeCommand,
    sourcePackage,
    ...opts
  })
}

/**
 * Creates a `CommandThunk` that executes a command using `execaNode()`.
 *
 * See: https://github.com/sindresorhus/execa#execanodescriptpath-arguments-options
 */
command.node = (nodeScript: string, opts: CommandOptions = {}) => {
  ow(nodeScript, 'nodeScript', ow.string)

  // Get the name of the package that defined this command.
  const sourcePackage = getPackageNameFromCallsite(callsites()[1])

  return commandBuilder({
    executable: nodeScript,
    executor: executeNodeCommand,
    sourcePackage,
    ...opts
  })
}