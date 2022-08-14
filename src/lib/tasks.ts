import callsites from 'callsites';

import { IS_TASK_THUNK } from 'etc/constants';
import log from 'lib/log';
import ow from 'lib/ow';
import { getPackageNameFromCallsite } from 'lib/utils';

import type {
  TaskDescriptor,
  TaskFn,
  TaskThunk
} from 'etc/types';


/**
 * Map of registered task names to their corresponding task thunks.
 */
export const tasks = new Map<string, TaskDescriptor>();


/**
 * Provided a name and a task function, registers the task and returns a thunk
 * that, when called, will invoke the task function.
 */
export function task(name: string, taskFn: TaskFn) {
  try {
    // Validate parameters.
    ow(name, 'task name', ow.string);
    ow(taskFn, 'task function', ow.function);

    // Get the name of the package that defined this task.
    const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

    const taskThunk = async () => {
      log.verbose(log.prefix('task'), 'exec:', log.chalk.green(name));

      try {
        await taskFn();
      } catch (err: any) {
        throw new Error(`Task "${name}" failed: ${err.message}`);
      }
    };

    Object.defineProperties(taskThunk, {
      name: { value: name },
      [IS_TASK_THUNK]: { value: true as const }
    });

    tasks.set(name, {
      name,
      sourcePackage,
      thunk: taskThunk as TaskThunk
    });

    return taskThunk as TaskThunk;
  } catch (err: any) {
    console.log(err);
    err.message = `Unable to create task "${name}": ${err.message}`;
    throw err;
  }
}
