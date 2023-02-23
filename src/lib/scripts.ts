import { EOL } from 'os';

import { default as callsites } from 'callsites';
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
  ScriptOptions,
  Instruction,
  ScriptDescriptor,
  ScriptThunk,
  Thunk
} from 'etc/types';
import { commands } from 'lib/commands';
import log from 'lib/log';
import matchSegmentedName from 'lib/matcher';
import ow from 'lib/ow';
import { tasks } from 'lib/tasks';
import {
  caseInsensitiveGet,
  getPackageNameFromCallsite,
  resolveCommand
} from 'lib/utils';


/**
 * An `Instruction` in `string` form will be converted into an object of the
 * following shape.
 */
export interface ParsedInstruction {
  type: 'cmd' | 'task' | 'script';
  name: string;
}


/**
 * Map of registered script names to their descriptors.
 */
export const scripts = new Map<string, ScriptDescriptor>();


/**
 * @private
 *
 * Parses a string identifier for a script or command and returns an object
 * describing it.
 */
function parseStringInstruction(value: string) {
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

    throw new TypeError('Provided function is not a command, task, or script.');
  }

  // If the user provided a string, parse it and look-up the indicated command,
  // task, or script.
  if (typeof value === 'string') {
    const { type, name } = parseStringInstruction(value);

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
  const multipleSources = scriptSources.length > 1; // || !R.includes('local', scriptSources);
  const onlyLocalSources = scriptSources.length === 1 && R.includes('local', scriptSources);

  const printScript = (descriptor: ScriptDescriptor) => {
    const { name, sourcePackage, options: { description } } = descriptor;

    const segments: Array<string> = [];

    if (multipleSources) {
      if (sourcePackage !== 'unknown') {
        if (sourcePackage === 'local') {
          // Scripts from the local package.
          segments.push(`${log.chalk.green(name)} ${log.chalk.dim(`(${sourcePackage})`)}`);
        } else {
          // Scripts from third-party packages.
          segments.push(`${log.chalk.green(name)} ${log.chalk.dim(`(from ${sourcePackage})`)}`);
        }
      } else {
        // if the source is "unknown", only show the script's name.
        segments.push(`${log.chalk.green(name)}`);
      }
    } else {
      segments.push(log.chalk.green(name));
    }

    if (description) {
      description.split(EOL).forEach((line, index) => {
        if (index === 0) {
          segments.push(`${log.chalk.gray.dim('└─')} ${log.chalk.gray(line)}`);
        } else {
          segments.push(`   ${log.chalk.gray(line)}`);
        }
      });
    }

    console.log(segments.join(EOL));
  };

  console.log(`${EOL}${log.chalk.bold('Available scripts:')}`);

  if (!onlyLocalSources && !multipleSources) {
    console.log(`${log.chalk.dim(`└─ All scripts from ${scriptSources[0]}.`)}`);
  }

  if (groupsUsed) {
    R.forEachObjIndexed((scriptConfigs, groupName) => {
      console.log('');
      console.log(log.chalk.underline(groupName));
      R.forEach(printScript, scriptConfigs);
    }, R.groupBy<ScriptDescriptor>(descriptor => descriptor.options.group ?? 'Other', allScripts));
  } else {
    console.log('');
    R.forEach(printScript, allScripts);
  }

  let nrIsInPath = false;

  try {
    resolveCommand('nr');
    nrIsInPath = true;
  } catch {
    // nr is not in $PATH.
  }

  console.log('');

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
export function matchScript(value?: string) {
  const scriptNames = [...scripts.keys()];

  if (scriptNames.length === 0) {
    throw new Error('No scripts have been registered.');
  }

  const scriptName = matchSegmentedName(scriptNames, value);
  const descriptor = scripts.get(scriptName ?? '');

  if (!descriptor) {
    throw new Error(`"${value}" did not match any scripts.`);
  }

  log.verbose(log.prefix('matchScript'), `Matched ${log.chalk.green(value)} to script ${log.chalk.green(scriptName)}.`);

  return descriptor;
}


/**
 * Provided a script descriptor, executes the script and any pre/post scripts
 * associated with it.
 */
export async function executeScript(script: ScriptDescriptor) {
  // const preScript = caseInsensitiveGet(`pre${script.name}`, scripts);
  // const postScript = caseInsensitiveGet(`post${script.name}`, scripts);

  // if (preScript) await preScript.thunk();
  await script.thunk();
  // if (postScript) await postScript.thunk();
}


/**
 * Provided a script options object, returns a function that, when invoked, will
 * execute the script. This function is then added to the scripts registry.
 */
export function script(name: string, opts: ScriptOptions) {
  try {
    // Validate name.
    ow(name, 'script name', ow.string);

    // Validate options.
    ow<Required<ScriptOptions>>(opts, ow.object.exactShape({
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

    // NB: This function does not catch errors. Failed commands will log
    // appropriate error messages and then re-throw, propagating errors up to
    // this function's caller.
    const scriptThunk = async () => {
      const runTime = log.createTimer();

      // Map each entry in the instruction sequence to its corresponding
      // command, task, or script. For nested arrays, map the array to a thunk
      // that runs each entry in parallel.
      const resolvedInstructions = opts.run.map(value => {
        if (Array.isArray(value)) {
          const resolvedInstructions = value.map(resolveInstruction);

          return async () => {
            await pAll(resolvedInstructions);
          };
        }

        return resolveInstruction(value);
      });

      // Instructions may be added to a script definition dynamically, meaning
      // it is possible that a script has zero instructions under certain
      // conditions. When this is the case, issue a warning and bail.
      if (resolvedInstructions.length === 0) {
        log.warn(log.prefix('script'), log.chalk.yellow.bold(`Script "${name}" contains no instructions.`));
        return;
      }

      log.verbose(log.prefix('script'), 'exec:', log.chalk.green(name));

      // Run each item in the command list in series. If an item is itself an
      // array, all commands in that step will be run in parallel.
      const preScript = caseInsensitiveGet(`pre${name}`, scripts);

      if (preScript) {
        await preScript.thunk();
      }

      await pSeries(resolvedInstructions);

      const postScript = caseInsensitiveGet(`post${name}`, scripts);

      if (postScript) {
        await postScript.thunk();
      }

      if (opts.timing) {
        log.info(log.prefix(name), log.chalk.gray(`Done in ${runTime}.`));
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
