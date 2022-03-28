import { IS_TASK_THUNK } from 'etc/constants';
import { TaskThunk, TaskFn } from 'etc/types';
import log from 'lib/log';


/**
 * Map of registered task names to their corresponding task thunks.
 */
export const tasks = new Map<string, TaskThunk>();


/**
 * Provided a name and a task function, registers the task and returns a thunk
 * that, when called, will invoke the task function.
 */
export function createTask(name: string, taskFn: TaskFn) {
  try {
    const taskThunk = Object.assign(async (...args: Array<any>) => {
      log.verbose(log.prefix('task'), 'exec:', log.chalk.green(name));

      try {
        await taskFn(...args);
      } catch (err: any) {
        throw new Error(`Task "${name}" failed: ${err.message}`);
      }
    }, {
      [IS_TASK_THUNK]: true
    });

    tasks.set(name, taskThunk);

    return taskThunk;
  } catch (err: any) {
    console.log(err);
    err.message = `Unable to create task "${name}": ${err.message}`;
    throw err;
  }
}
