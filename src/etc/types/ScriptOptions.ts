/**
 * Configuration options passed as the second argument to `script`.
 */
export interface ScriptOptions {
  /**
   * Name to use for the script when looking it up from a query and for logging
   * and debugging purposes.
   */
  name: string;

  /**
   * Description of what the script does. Used when showing available scripts
   * with the --scripts flag.
   */
  description?: string;

  /**
   * Group for the script. Used when showing available scripts with the
   * --scripts flag.
   */
  group?: string;

  /**
   * Set to `true` to print a script's total run time once it has finished.
   *
   * @default false
   */
  timing?: boolean;
}
