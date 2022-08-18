import type { CommandArguments } from './CommandArguments';
import type { CommandOptions } from './CommandOptions';
import type { CommandThunk } from './CommandThunk';


/**
 * Descriptor for a command that will be stored in the registry.
 */
export interface CommandDescriptor {
  name: string;
  sourcePackage: string;
  arguments: CommandArguments;
  options: CommandOptions;
  thunk: CommandThunk;
}
