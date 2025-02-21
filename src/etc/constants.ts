export const IS_COMMAND_THUNK = Symbol('CommandThunk')

export const IS_SCRIPT_THUNK = Symbol('ScriptThunk')

export const IS_FUNCTION_THUNK = Symbol('FnThunk')

export const NR_RED =  '#A3222B'

/**
 * POSIX signals and their corresponding exit codes which should not be treated
 * as erroneous. This is required because by default, Execa will throw on any
 * non-zero exit code.
 */
export const SIGNALS = {
  SIGINT: 130,
  SIGTERM: 143,
  SIGHUP: 129
}