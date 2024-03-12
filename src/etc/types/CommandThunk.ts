import type { IS_COMMAND_THUNK } from 'etc/constants';
import type { ExecaReturnValue } from 'execa';


/**
 * Return type of `command`.
 */
export interface CommandThunk {
  (): Promise<ExecaReturnValue>;
  [IS_COMMAND_THUNK]: true;
}
