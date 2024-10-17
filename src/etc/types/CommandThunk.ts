import type { IS_COMMAND_THUNK } from 'etc/constants'
import type { Options as ExecaOptions, ResultPromise } from 'execa'

/**
 * Return type of `command`.
 */
export interface CommandThunk<O extends ExecaOptions = ExecaOptions> {
  (): ResultPromise<O>
  [IS_COMMAND_THUNK]: true
}