import type { CommandBuilderOptions } from './CommandBuilderOptions'
import type { CommandThunk } from './CommandThunk'

/**
 * Descriptor for a command that will be stored in the registry.
 */
export interface CommandDescriptor extends CommandBuilderOptions {
  /**
   * At this point, this will be the command's resolved display name. If a name
   * property was omitted when defining the command, it will default to the
   * command itself.
   */
  name?: string

  /**
   * Package from which the command was defined.
   */
  sourcePackage: string

  /**
   * Un-parsed arguments.
   */
  unParsedArguments: Array<string> | undefined

  /**
   * Command thunk that may be invoked to execute the command.
   */
  thunk: CommandThunk
}