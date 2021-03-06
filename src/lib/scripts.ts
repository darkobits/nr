import { EOL } from 'os';

import emoji from 'node-emoji';
import pAll from 'p-all';
import pSeries from 'p-series';
import * as R from 'ramda';

import {
  IS_SCRIPT_THUNK,
  IS_COMMAND_THUNK,
  IS_TASK_THUNK
} from 'etc/constants';
import {
  CreateScriptOptions,
  Instruction,
  ScriptConfiguration,
  ScriptThunk,
  Thunk
} from 'etc/types';
import { commands, resolveCommand } from 'lib/commands';
import log from 'lib/log';
import matchSegmentedName from 'lib/matcher';
import ow from 'lib/ow';
import { tasks } from 'lib/tasks';


/**
 * Map of registered script names to their corresponding script thunks.
 */
export const scripts = new Map<string, ScriptThunk>();


/**
 * @private
 *
 * Map of registered script thunks to their provided configurations.
 * Configurations stored here also contain the script's `name`.
 */
const scriptConfigs = new Map<string, ScriptConfiguration>();


/**
 * @private
 *
 * Parses a string identifier for a script or command and returns an object
 * describing it.
 */
function parseIdentifier(value: string) {
  if (value.includes(':')) {
    const [type, name] = value.split(':');

    if (!['script', 'cmd', 'task'].includes(type)) {
      throw new Error(`Invalid type: ${type}`);
    }

    return { type, name };
  }

  return { type: 'unknown', name: value };
}


/**
 * @private
 *
 * Provided a CommandThunk, ScriptThunk, TaskThunk, returns the value as-is. If
 * provided a string, attempts to resolve it to one of the above. Strings may
 * begin with 'cmd:', 'script:' or 'task:' to indicate the type to be resolved.
 */
function resolveInstruction(value: Instruction): Thunk {
  if (typeof value === 'function') {
    if (
      Reflect.has(value, IS_SCRIPT_THUNK) ||
      Reflect.has(value, IS_COMMAND_THUNK) ||
      Reflect.has(value, IS_TASK_THUNK)
    ) {
      return value;
    }

    throw new TypeError('Provided function is neither a ScriptThunk nor a CommandThunk.');
  }

  if (typeof value === 'string') {
    const { type, name } = parseIdentifier(value);
    const scriptThunk = scripts.get(name);
    const commandThunk = commands.get(name);
    const taskThunk = tasks.get(name);

    if (type === 'script' && scriptThunk) {
      return scriptThunk;
    }

    if (type === 'command' && commandThunk) {
      return commandThunk;
    }

    if (type === 'task' && taskThunk) {
      return taskThunk;
    }

    if (scriptThunk) {
      return scriptThunk;
    }

    if (commandThunk) {
      return commandThunk;
    }

    if (taskThunk) {
      return taskThunk;
    }

    if (type === 'unknown' && scriptThunk && commandThunk && taskThunk) {
      throw new Error(`Instruction "${value}" is ambiguous. Disambiguate using a "cmd:", "script:", or "task:" prefix.`);
    }

    throw new Error(`Unable to resolve "${value}" to a script, command, or task.`);
  }

  throw new TypeError(`Expected instruction to be of type "string" or "function", got "${typeof value}".`);
}


/**
 * Provided a script options object, returns a function that, when invoked, will
 * execute the script. This function is then added to the scripts registry.
 */
export function script(name: string, opts: CreateScriptOptions) {
  try {
    // Validate name.
    ow(name, 'script name', ow.string);

    // Validate options.
    ow<Required<CreateScriptOptions>>(opts, ow.object.exactShape({
      description: ow.string,
      group: ow.optional.string,
      run: ow.array.ofType(ow.any(
        ow.string,
        ow.function,
        ow.array.ofType(ow.any(
          ow.string,
          ow.function
        ))
      )),
      timing: ow.optional.boolean
    }));

    // Map each entry in the instruction sequence to its corresponding command
    // thunk or script thunk. For nested arrays, map the array to a thunk that
    // runs each entry in parallel.
    const validatedInstructions = opts.run.map(value => {
      if (Array.isArray(value)) {
        return async () => {
          await pAll(value.map(resolveInstruction));
        };
      }

      return resolveInstruction(value);
    });

    // NB: This function does not catch errors. Failed commands will log
    // appropriate error messages and then re-throw, propagating errors up to
    // this function's caller.
    const scriptThunk: ScriptThunk = Object.assign(async () => {
      // Instructions may be added to a script definition dynamically, meaning
      // it is possible that a script has zero instructions under certain
      // conditions. When this is the case, issue a warning and bail.
      if (validatedInstructions.length === 0) {
        log.warn(log.prefix('script'), log.chalk.yellow.bold(`Script "${name}" contains no instructions.`));
        return;
      }

      log.verbose(log.prefix('script'), 'exec:', log.chalk.green(name));

      const runTime = log.createTimer();

      // Run each item in the command list in series. If an item is itself an
      // array, all commands in that step will be run in parallel.
      await pSeries(validatedInstructions);

      if (opts.timing) {
        log.verbose(log.prefix('script'), log.chalk.gray(`Script ${log.chalk.green.dim(name)} done in ${runTime}.`));
      }
    }, {
      [IS_SCRIPT_THUNK]: true
    });

    Reflect.defineProperty(scriptThunk, 'name', { value: name });

    scripts.set(name, scriptThunk);
    scriptConfigs.set(name, {...opts, name });

    return scriptThunk;
  } catch (err: any) {
    throw new Error(`Unable to create script "${name}": ${err.message}`);
  }
}


/**
 * Prints all available scripts and their descriptions.
 */
export function printAvailableScripts() {
  let nrIsInPath = false;
  const allConfigs = Array.from(scriptConfigs.values());

  try {
    resolveCommand('nr');
    nrIsInPath = true;
  } catch {
    // nr is not in PATH.
  }

  if (nrIsInPath) {
    console.log(log.chalk.gray(`${EOL}${emoji.get('sparkles')} ${log.chalk.white.bold('nr')} is in your PATH. You can run scripts using: ${log.chalk.white('nr <script name>')}`));
  } else {
    console.log(log.chalk.gray(`${EOL}${emoji.get('exclamation')} ${log.chalk.white.bold('nr')} is ${log.chalk.red('not')} in your PATH. You must run scripts using: ${log.chalk.white('npx nr <script name>')}`));
  }

  console.log(`${EOL}Available scripts:${EOL}`);

  R.forEachObjIndexed((scriptConfigs, groupName) => {
    console.log(log.chalk.underline(groupName));

    R.forEach(scriptConfig => {
      console.log(log.chalk.green(scriptConfig.name), `??? ${log.chalk.gray(scriptConfig.description)}`);
    }, scriptConfigs);

    console.log('');
  }, R.groupBy<CreateScriptOptions & { name: string }>(scriptConfig => {
    return scriptConfig.group ?? 'Other';
  }, allConfigs));
}


/**
 * Provided a search query, matches the query to a registered script and returns
 * its configuration.
 */
export function matchScript(value: string | undefined) {
  const scriptNames = [...scripts.keys()];

  if (scriptNames.length === 0) {
    throw new Error('No scripts have been registered.');
  }

  const scriptName = matchSegmentedName(scriptNames, value);

  if (!scriptName) {
    throw new Error(`"${value}" did not match any scripts.`);
  }

  log.verbose(`Matched ${log.chalk.green(value)} to script ${log.chalk.green(scriptName)}.`);

  const scriptThunk = scripts.get(scriptName) as ScriptThunk;
  return scriptConfigs.get(scriptThunk.name) as ScriptConfiguration;
}


/**
 * Provided a script name search query, matches the query to a registered script
 * and executes it. If no match could be found, throws an error.
 */
export async function executeScript(scriptName: string) {
  if (!scripts.has(scriptName)) {
    throw new Error(`Unknown script: "${scriptName}".`);
  }

  const preScriptName = `pre${scriptName}`;

  if (scripts.has(preScriptName)) {
    log.verbose(`Running pre-script "${preScriptName}"`);
    const preScriptThunk = scripts.get(preScriptName) as ScriptThunk;
    await preScriptThunk();
  }

  const scriptThunk = scripts.get(scriptName) as ScriptThunk;

  await scriptThunk();

  const postScriptName = `post${scriptName}`;

  if (scripts.has(postScriptName)) {
    log.verbose(`Running post-script "${preScriptName}"`);
    const postScriptThunk = scripts.get(postScriptName) as ScriptThunk;
    await postScriptThunk();
  }
}
