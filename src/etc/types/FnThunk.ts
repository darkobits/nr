import type { IS_FUNCTION_THUNK } from 'etc/constants'

/**
 * Return type of `fn`.
 */
export interface FnThunk {
  (): Promise<void>
  [IS_FUNCTION_THUNK]: true
}