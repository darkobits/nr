import type { IS_COMMAND_THUNK } from 'etc/constants';


/**
 * Return type of `command`.
 */
export interface CommandThunk {
  (): Promise<void>;
  [IS_COMMAND_THUNK]: true;
}
