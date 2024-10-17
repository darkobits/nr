import type { Thunk } from './Thunk'

/**
 * An `Instruction` indicates what a script should do. Scripts may run commands,
 * functions, or other scripts. An `Instruction` may therefore be:
 *
 * - a `string` in the form `cmd:command-name` to execute a command
 * - a `string` in the form `fn:function-name` to execute a function
 * - a `string` in the form `script:script-name` to execute a script
 * - the value returned by `command`, `fn`, or `script`
 */
export type Instruction = string | Thunk | false | undefined;

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
 * [
 *   ['cmd:babel', 'cmd:lint', 'cmd:type-check'],
 *   'cmd:cleanup'
 * ]
 *
 * Note: If a script should run a single group of Instructions in parallel,
 * a nested array is still required to indicate parallelization:
 *
 * [
 *   ['cmd:build', 'cmd:lint', 'cmd:test']
 * ]
 */
export type InstructionSet = (Array<Instruction | Array<Instruction>>) | Instruction;