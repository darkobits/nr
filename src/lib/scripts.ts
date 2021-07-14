import type execa from 'execa';
import ow from 'ow';
import pAll from 'p-all';
import pSeries from 'p-series';

import { CreateScriptOptions, ScriptThunk } from 'etc/types';
import { commands } from 'lib/commands';
import log from 'lib/log';
import { matchSegmentedName } from 'lib/utils';


/**
 * @private
 *
 * Map of registered script names to their corresponding script thunks.
 */
const scripts = new Map<string, ScriptThunk>();


/**
 * @private
 *
 * Map of registered script names to their provided configurations.
 */
const scriptConfigs = new Map<string, CreateScriptOptions>();


/**
 * Provided a script options object, returns a function that, when invoked, will
 * execute the script. This function is then added to the scripts registry.
 */
export function createScript(opts: CreateScriptOptions) {
  try {
    // Validate options.
    ow<CreateScriptOptions>(opts, ow.object.exactShape({
      name: ow.string,
      description: ow.string,
      commands: ow.array.ofType(ow.any(
        ow.string,
        ow.array.ofType(ow.string)
      ))
    }));

    // Prevent overwriting of existing scripts.
    if (scripts.has(opts.name)) {
      throw new Error(`Script "${opts.name}" has already been registered.`);
    }

    // Map each string in the command sequence to its corresponding command
    // thunk, or throw an error if the command is not registered.
    const validatedCommands = opts.commands.map(commandOrCommandArray => {
      if (typeof commandOrCommandArray === 'string') {
        const commandThunk = commands.get(commandOrCommandArray);

        if (!commandThunk) {
          throw new Error(`Unknown command: "${commandOrCommandArray}"`);
        }

        return commandThunk;
      }

      return commandOrCommandArray.map(command => {
        const commandThunk = commands.get(command);

        if (!commandThunk) {
          throw new Error(`Unknown command: "${command}"`);
        }

        return commandThunk;
      });
    });

    scriptConfigs.set(opts.name, opts);

    // NB: This function does not catch errors. Failed commands will log
    // appropriate error messages and then re-throw, propagating errors up to
    // this function's caller.
    scripts.set(opts.name, async () => {
      const time = log.createTimer();

      // Run each item in the command list in series. If an item is itself an
      // array, all commands in that step will be run in parallel.
      await pSeries<execa.ExecaReturnValue | Array<execa.ExecaReturnValue>>(validatedCommands.map(commandOrCommandArray => {
        // For arrays of commands, run them in parallel using p-all.
        if (Array.isArray(commandOrCommandArray)) {
          return async () => pAll(commandOrCommandArray);
        }

        // For single commands, return the command as-is to be run in series.
        return commandOrCommandArray;
      }));

      log.info(log.prefix(opts.name), log.chalk.gray(`Done in ${time}.`));
    });
  } catch (err) {
    log.error(log.chalk.red.bold(`Unable to create script "${opts.name}": ${err.message.split()}.`));

    // Re-throw errors related to creating scripts so that our caller can exit
    // with a non-zero code.
    throw err;
  }
}


/**
 * Provided a script name search query, matches the query to a registered script
 * and executes it. If no match could be found, throws an error.
 */
export async function executeScript(name: string) {
  const scriptNames = [...scripts.keys()];

  if (scriptNames.length === 0) {
    throw new Error('No scripts have been registered.');
  }

  const scriptName = matchSegmentedName(scriptNames, name);

  if (!scriptName) {
    throw new Error(`"${name}" did not match any scripts.`);
  }

  log.verbose(`Matched ${log.chalk.green(name)} to script ${log.chalk.green(scriptName)}.`);

  const preScriptName = `pre${scriptName}`;

  if (scripts.has(preScriptName)) {
    log.verbose(`Running pre-script "${preScriptName}"`);
    const preScriptThunk = scripts.get(preScriptName) as ScriptThunk;
    await preScriptThunk();
  }

  const scriptThunk = scripts.get(scriptName) as ScriptThunk;

  const postScriptName = `post${scriptName}`;

  if (scripts.has(postScriptName)) {
    log.verbose(`Running post-script "${preScriptName}"`);
    const postScriptThunk = scripts.get(postScriptName) as ScriptThunk;
    await postScriptThunk();
  }

  await scriptThunk();
}


export { scripts, scriptConfigs };
