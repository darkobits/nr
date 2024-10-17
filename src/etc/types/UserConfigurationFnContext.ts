import type { command } from 'lib/commands'
import type { fn } from 'lib/functions'
import type { script } from 'lib/scripts'

/**
 * Context passed to user configuration functions.
 */
export interface UserConfigurationFnContext {
  /**
   * Provided a name and a command configuration, registers the command and
   * returns a `CommandThunk`.
   */
  command: typeof command

  /**
   * Provided a name and a function, registers the function and returns a
   * `FnThunk`.
   */
  fn: typeof fn

  /**
   * Provided a name and a script configuration, registers the script and
   * returns a `ScriptThunk`.
   */
  script: typeof script
}