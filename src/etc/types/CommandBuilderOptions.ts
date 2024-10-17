import { CommandExecutor } from './CommandExecutor'
import { CommandOptions } from './CommandOptions'

/**
 * Once a command is received by command creation function (ie: `command`,
 * `command.node`) the command name is extracted from the first argument and an
 * executor function is assigned. The source package is also determined at this
 * time. These properties are added to the `CommandOptions` object and passed
 * to the command builder for further processing.
 */
export interface CommandBuilderOptions extends CommandOptions {
  executable: string
  executor: CommandExecutor
  sourcePackage: string
}