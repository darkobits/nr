import type { IS_TASK_THUNK } from 'etc/constants';


/**
 * Return type of `task`.
 */
export interface TaskThunk {
  (): Promise<void>;
  [IS_TASK_THUNK]: true;
}
