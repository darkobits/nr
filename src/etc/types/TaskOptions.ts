/**
 * Additional options that may be passed as a second argument to `task()`.
 *
 * @example
 *
 * ```ts
 * task(() => {
 *   return true;
 * }, {
 *   name: 'my-awesome-task'
 * })
 * ```
 */
export interface TaskOptions {
  /**
   * Optional name for the task. This name may be used to reference the task in
   * a script, and it will also be used for error-reporting.
   */
  name?: string;
}
