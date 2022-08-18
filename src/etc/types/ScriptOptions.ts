import type { Instruction } from './Instruction';

/**
 * Configuration options passed as the second argument to `script`.
 */
export interface ScriptOptions {
  /**
   * Array of Instructions that this script will run.
   *
   * An inner array may be used to indicate that a set of Instructions should be
   * run in parallel. However, nesting beyond a depth of 2 is not allowed. If
   * you need complex parallelization, define individual scripts and compose
   * them.
   *
   * @example
   *
   * For example, if Commands 'lint', 'babel', 'type-check', and 'cleanup' were
   * registered, and we wanted to run the 'babel', 'lint', and 'type-check'
   * commands in parallel followed by the 'cleanup' command, we would express
   * that thusly:
   *
   * run: [
   *   ['cmd:babel', 'cmd:lint', 'cmd:type-check'],
   *   'cmd:cleanup'
   * ]
   *
   * Note: If a script should run a single group of Instructions in parallel,
   * a nested array is still required to indicate parallelization:
   *
   * run: [
   *   ['cmd:build', 'cmd:lint', 'cmd:test']
   * ]
   */
  run: Array<Instruction | Array<Instruction>>;

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
