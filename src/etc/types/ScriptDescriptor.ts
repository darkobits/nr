import type { ScriptOptions } from './ScriptOptions'
import type { ScriptThunk } from './ScriptThunk'

/**
 * Descriptor for a script that will be stored in the registry.
 */
export interface ScriptDescriptor {
  name: string
  sourcePackage: string
  options: ScriptOptions
  thunk: ScriptThunk
}