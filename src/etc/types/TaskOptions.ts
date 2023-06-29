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
  name?: string;
}
