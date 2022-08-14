import { EOL } from 'node:os';

import callsites from 'callsites';
import emoji from 'node-emoji';
import pAll from 'p-all';
import pSeries from 'p-series';
import * as R from 'ramda';

import {
  IS_COMMAND_THUNK,
  IS_TASK_THUNK,
  IS_SCRIPT_THUNK
} from 'etc/constants';
import {
  CreateScriptOptions,
  Instruction,
  ParsedInstruction,
  ScriptDescriptor,
  ScriptThunk,
  Thunk
} from 'etc/types';
import { commands, resolveCommand } from 'lib/commands';
import log from 'lib/log';
import matchSegmentedName from 'lib/matcher';
import ow from 'lib/ow';
import { tasks } from 'lib/tasks';
import {
  caseInsensitiveGet,
  getPackageNameFromCallsite
} from 'lib/utils';


/**
 * Map of registered script names to their corresponding script thunks.
 */
export const scripts = new Map<string, ScriptDescriptor>();


/**
 * @private
 *
 * Parses a string identifier for a script or command and returns an object
 * describing it.
 */
function parseInstruction(value: string) {
  if (!value.includes(':')) {
    throw new Error(`Invalid instruction identifier: "${value}"`);
  }

  const [type, name] = value.split(':');

  if (!['script', 'cmd', 'task'].includes(type)) {
    throw new Error(`Invalid instruction type: ${type}`);
  }

  return { type, name } as ParsedInstruction;
}


/**
 * @private
 *
 * If provided a CommandThunk, TaskThunk, or ScriptThunk, returns the value
 * as-is. If provided a string, attempts to resolve it to one of the above.
 * Strings may begin with 'cmd:', 'task:', or 'script:' to indicate the type to
 * be resolved.
 */
function resolveInstruction(value: Instruction): Thunk {
  // If the user provided a thunk directly in a script, we don't need to look it
  // up in the registry.
  if (typeof value === 'function') {
    if (
      Reflect.has(value, IS_SCRIPT_THUNK) ||
      Reflect.has(value, IS_COMMAND_THUNK) ||
      Reflect.has(value, IS_TASK_THUNK)
    ) {
      return value;
    }

    throw new TypeError('Provided function is not a CommandThunk, TaskThunk, or ScriptThunk.');
  }

  // If the user provided a string, parse it and look-up the indicated command,
  // task, or script.
  if (typeof value === 'string') {
    const { type, name } = parseInstruction(value);

    if (type === 'cmd') {
      const commandDescriptor = caseInsensitiveGet(name, commands);
      if (!commandDescriptor) throw new Error(`Unknown command: "${name}"`);
      return commandDescriptor.thunk;
    }

    if (type === 'task') {
      const taskDescriptor = caseInsensitiveGet(name, tasks);
      if (!taskDescriptor) throw new Error(`Unknown task: "${name}"`);
      return taskDescriptor.thunk;
    }

    if (type === 'script') {
      const scriptDescriptor = caseInsensitiveGet(name, scripts);
      if (!scriptDescriptor) throw new Error(`Unknown script: "${name}"`);
      return scriptDescriptor.thunk;
    }
  }

  throw new TypeError(`Expected instruction to be of type "string" or "function", got "${typeof value}".`);
}


/**
 * Prints all available scripts and their descriptions. Also determines if `nr`
 * is in the users $PATH and can be invoked directly, or if the user needs to
 * use `npx`.
 */
export function printScriptInfo() {
  const allScripts = Array.from(scripts.values());

  if (allScripts.length === 0) {
    console.log('No scripts have been registered.');
    return;
  }

  const groupsUsed = R.any(R.hasPath(['options', 'group']), allScripts);
  const scriptSources = R.uniq(R.map(R.path(['sourcePackage']), allScripts));
  const multipleSources = scriptSources.length > 1 || !R.includes('local', scriptSources);

  const printScript = (descriptor: ScriptDescriptor) => {
    const { name, sourcePackage, options: { description } } = descriptor;

    const segments: Array<string> = [];

    if (multipleSources) {
      if (sourcePackage === 'local') {
        segments.push(`${log.chalk.green(name)} ${log.chalk.gray.dim('(local)')}`);
      } else {
        segments.push(`${log.chalk.green(name)} ${log.chalk.gray.dim(`(${sourcePackage})`)}`);
      }
    } else {
      segments.push(log.chalk.green(name));
    }

    if (description) {
      segments.push(`${log.chalk.gray.dim('└─')} ${log.chalk.gray(description)}`);
    }

    console.log(segments.join(EOL));
  };

  console.log(`${EOL}${log.chalk.bold('Available scripts:')}${EOL}`);

  if (groupsUsed) {
    R.forEachObjIndexed((scriptConfigs, groupName) => {
      console.log(log.chalk.underline(groupName));
      R.forEach(printScript, scriptConfigs);
      console.log('');
    }, R.groupBy<ScriptDescriptor>(descriptor => descriptor.options.group ?? 'Other', allScripts));
  } else {
    R.forEach(printScript, allScripts);
  }

  let nrIsInPath = false;

  try {
    resolveCommand('nr');
    nrIsInPath = true;
  } catch {
    // nr is not in $PATH.
  }

  if (nrIsInPath) {
    console.log(log.chalk.gray(`${emoji.get('sparkles')} ${log.chalk.white.bold('nr')} is in your PATH. You can run scripts using: ${log.chalk.white('nr <script name>')}`));
  } else {
    console.log(log.chalk.gray(`${emoji.get('exclamation')} ${log.chalk.white.bold('nr')} is ${log.chalk.red('not')} in your PATH. You must run scripts using: ${log.chalk.white('npx nr <script name>')}`));
  }
}


/**
 * Provided a search query, matches the query to a registered script and returns
 * its descriptor.
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

  return caseInsensitiveGet(scriptName, scripts) as ScriptDescriptor;
}


/**
 * Provided a script name search query, matches the query to a registered script
 * and executes it. If no match could be found, throws an error.
 */
export async function executeScript(scriptName: string) {
  const scriptDescriptor = caseInsensitiveGet(scriptName, scripts);

  if (!scriptDescriptor) {
    throw new Error(`Unknown script: "${scriptName}".`);
  }

  const preScriptDescriptor = caseInsensitiveGet(`pre${scriptName}`, scripts);

  if (preScriptDescriptor) {
    await preScriptDescriptor.thunk();
  }

  await scriptDescriptor.thunk();

  const postScriptDescriptor = caseInsensitiveGet(`post${scriptName}`, scripts);

  if (postScriptDescriptor) {
    await postScriptDescriptor.thunk();
  }
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
      description: ow.optional.string,
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

    // Get the name of the package that defined this script.
    const sourcePackage = getPackageNameFromCallsite(callsites()[1]);

    // Map each entry in the instruction sequence to its corresponding command,
    // task, or script. For nested arrays, map the array to a thunk that runs
    // each entry in parallel.
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
    const scriptThunk = async () => {
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
    };

    Object.defineProperties(scriptThunk, {
      name: { value: name },
      [IS_SCRIPT_THUNK]: { value: true as const }
    });

    scripts.set(name, {
      name,
      sourcePackage,
      options: opts,
      thunk: scriptThunk as ScriptThunk
    });

    return scriptThunk as ScriptThunk;
  } catch (err: any) {
    throw new Error(`Unable to create script "${name}": ${err.message}`);
  }
}
