import type { IS_SCRIPT_THUNK } from 'etc/constants'

/**
 * Return type of `script`.
 */
export interface ScriptThunk {
  (): Promise<void>
  [IS_SCRIPT_THUNK]: true
}