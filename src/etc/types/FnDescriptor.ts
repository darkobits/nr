import type { FnThunk } from './FnThunk';


/**
 * Descriptor for a Function that will be stored in the registry.
 */
export interface FnDescriptor {
  name: string;
  sourcePackage: string;
  thunk: FnThunk;
}
