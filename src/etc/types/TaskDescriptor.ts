import type { TaskThunk } from './TaskThunk';


/**
 * Descriptor for a Task that will be stored in the registry.
 */
export interface TaskDescriptor {
  name: string;
  sourcePackage: string;
  thunk: TaskThunk;
}
