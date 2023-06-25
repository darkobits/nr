import { EOL } from 'os';

import callsites from 'callsites';
import ow from 'ow';
import * as R from 'ramda';

import { IS_TASK_THUNK } from 'etc/constants';
import log from 'lib/log';
import { getPackageNameFromCallsite } from 'lib/utils';

import type {
  TaskDescriptor,
  TaskFn,
  TaskThunk
} from 'etc/types';


/**
 * Map of registered task names to their corresponding descriptors.
 */
export const tasks = new Map<string, TaskDescriptor>();


/**
 * Prints all available tasks.
 */
export function printTaskInfo() {
  const allTasks = Array.from(tasks.values());

  if (allTasks.length === 0) {
    console.log('No tasks have been registered.');
    return;
  }

  const taskSources = R.uniq(R.map(R.path(['sourcePackage']), allTasks));
  const multipleSources = taskSources.length > 1 || !R.includes('local', taskSources);

  console.log(`${EOL}${log.chalk.bold('Available tasks:')}${EOL}`);

  // N.B. Ramda broke inference for array member types when using R.forEach in
  // 0.29.0.
  allTasks.forEach(task => {
    const segments: Array<string> = [];

    if (multipleSources) {
      if (task.sourcePackage !== 'unknown') {
        // includes "local", and other third-party packages.
        segments.push(`${log.chalk.green(task.name)} ${log.chalk.gray.dim(`(${task.sourcePackage})`)}`);
      } else {
        // if the source is "unknown", only show the script's name.
        segments.push(`${log.chalk.green(task.name)}`);
      }
    } else {
      segments.push(log.chalk.green(task.name));
    }

    console.log(segments.join(EOL));
  });

  console.log('');
}


/**
 * Provided a name and function, registers a new task and returns a thunk that,
 * when invoked, will call the task function.
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
