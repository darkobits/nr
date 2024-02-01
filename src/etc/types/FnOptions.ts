/**
 * Additional options that may be passed as a second argument to `fn()`.
 *
 * @example
 *
 * ```ts
 * fn(() => {
 *   return true;
 * }, {
 *   name: 'my-awesome-function'
 * })
 * ```
 */
export interface FnOptions {
  /**
   * Optional name for the function. This name may be used to reference the
   * function in a script, and will also be used for error-reporting.
   */
  name?: string;
}
