/**
 * Configuration options passed as the second argument to `script`.
 */
export interface ScriptOptions {
  /**
   * Description of what the script does. Used when showing available scripts
   * with the --scripts flag.
   */
  description?: string

  /**
   * Group for the script. Used when showing available scripts with the
   * --scripts flag.
   */
  group?: string

  /**
   * Set to `true` to print a script's total run time once it has finished.
   *
   * @default false
   */
  timing?: boolean

  /**
   * If `true`, the script will not appear in the --scripts output.
   *
   * @default false
   */
  hidden?: boolean
}