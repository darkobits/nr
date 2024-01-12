import type { command } from 'lib/commands';
import type { script } from 'lib/scripts';
import type { task } from 'lib/tasks';


/**
 * Context passed to user configuration functions.
 */
export interface UserConfigurationFnContext {
  /**
   * Provided a name and a command configuration, registers the command and
   * returns a `CommandThunk`.
   */
  command: typeof command;

  /**
   * Provided a name and a task function, registers the task and returns a
   * `TaskThunk`.
   */
  task: typeof task;

  /**
   * Provided a name and a script configuration, registers the script and
   * returns a `ScriptThunk`.
   */
  script: typeof script;
}
