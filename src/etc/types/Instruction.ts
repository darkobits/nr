import type { Thunk } from './Thunk';


/**
 * An `Instruction` indicates what a script should do. Scripts may run commands,
 * tasks, or other scripts. An `Instruction` may therefore be:
 *
 * - a `string` in the form `cmd:command-name` to execute a command
 * - a `string` in the form `task:task-name` to execute a task
 * - a `string` in the form `script:script-name` to execute a script
 * - the value returned by `command`, `task`, or `script`
 */
export type Instruction = string | Thunk;
