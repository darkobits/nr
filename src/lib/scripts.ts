import boxen from 'boxen';
import callsites from 'callsites';
import ow from 'ow';
import pAll from 'p-all';
import pSeries from 'p-series';
import * as R from 'ramda';

import {
  IS_COMMAND_THUNK,
  IS_TASK_THUNK,
  IS_SCRIPT_THUNK
} from 'etc/constants';
import { commands } from 'lib/commands';
import log from 'lib/log';
import matchSegmentedName from 'lib/matcher';
import { tasks } from 'lib/tasks';
import {
  caseInsensitiveGet,
  heroLog,
  getPackageNameFromCallsite,
  getPrefixedInstructionName,
  resolveCommand
} from 'lib/utils';

import type { SaffronHandlerContext } from '@darkobits/saffron';
import type {
  CLIArguments,
  ConfigurationFactory,
  ScriptOptions,
  Instruction,
  ScriptDescriptor,
  ScriptThunk,
  Thunk
} from 'etc/types';


const chalk = log.chalk;


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
function parseStringInstruction(value: string): ParsedInstruction {
  if (!value.includes(':')) {
    throw new Error(`Invalid instruction identifier: "${value}"`);
  }

  const [type, name] = value.split(':') as any;

  if (!['script', 'cmd', 'task'].includes(type)) {
    throw new Error(`Invalid type: "${type}" in instruction "${value}".`);
  }

  return { type, name };
}


/**
 * @private
 *
 * If provided a CommandThunk, TaskThunk, or ScriptThunk, returns the value
 * as-is. If provided a string, attempts to resolve it to one of the above.
 * Strings may begin with 'cmd:', 'task:', or 'script:' to indicate the type to
 * be resolved.
 */
function resolveInstructionToThunk(value: Instruction): Thunk {
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

    throw new TypeError('[resolveInstructionToThunk] Provided function is not a command, task, or script.');
  }

  // If the user provided a string, parse it and look-up the indicated command,
  // task, or script.
  if (typeof value === 'string') {
    const { type, name } = parseStringInstruction(value);

    if (type === 'cmd') {
      const commandDescriptor = caseInsensitiveGet(name, commands);
      if (!commandDescriptor) throw new Error(`[resolveInstructionToThunk] Unknown command: "${name}"`);
      return commandDescriptor.thunk;
    }

    if (type === 'task') {
      const taskDescriptor = caseInsensitiveGet(name, tasks);
      if (!taskDescriptor) throw new Error(`[resolveInstructionToThunk] Unknown task: "${name}"`);
      return taskDescriptor.thunk;
    }

    if (type === 'script') {
      const scriptDescriptor = caseInsensitiveGet(name, scripts);
      if (!scriptDescriptor) throw new Error(`[resolveInstructionToThunk] Unknown script: "${name}"`);
      return scriptDescriptor.thunk;
    }
  }

  throw new TypeError(`[resolveInstructionToThunk] Expected instruction to be of type "string" or "function", got "${typeof value}".`);
}


/**
 * Prints all available scripts and their descriptions. Also determines if `nr`
 * is in the users $PATH and can be invoked directly, or if the user needs to
 * use `npx`.
 */
export function printScriptInfo(context: SaffronHandlerContext<CLIArguments, ConfigurationFactory>) {
  const allScripts = Array.from(scripts.values());

  if (allScripts.length === 0) {
    log.info('No scripts are registered.');
    if (context.configPath) {
      log.info(`Configuration file: ${context.configPath}`);
    } else {
      log.warn('No configuration file found.');
    }
    return;
  }

  const printScript = (descriptor: ScriptDescriptor) => {
    const { name, sourcePackage, options: { description } } = descriptor;

    let title = chalk.green.bold(name);

    // Build script name, including package of origin.
    const scriptSources = R.uniq(R.map(R.path(['sourcePackage']), allScripts));
    // Hide origin descriptors if all packages are local.
    const hideOriginDescriptors = scriptSources.length === 1 && scriptSources[0] === 'local';

    if (!hideOriginDescriptors && sourcePackage !== 'unknown') {
      title += sourcePackage === 'local'
        // Scripts from the local package.
        ? ` ${chalk.green.dim('local')}`
        // Scripts from third-party packages.
        : ` ${chalk.green.dim(`via ${sourcePackage}`)}`;
    }

    const finalDescription = description
      ? chalk.gray(description.trim())
      : chalk.cyan.dim('No description available.');

    console.log(boxen(finalDescription, {
      title,
      padding: {
        top: 0,
        left: 1,
        right: 1,
        bottom: 0
      },
      margin: 0,
      borderColor: '#242424'
    }));
  };

  console.log('');
  heroLog('• available scripts');

  const groupsUsed = R.any(R.hasPath(['options', 'group']), allScripts);

  if (groupsUsed) {
    R.forEachObjIndexed((scriptConfigs, groupName) => {
      console.log('');
      console.log(`${chalk.bold(groupName)}\n`);
      R.forEach(printScript, scriptConfigs);
    }, R.groupBy<ScriptDescriptor>(descriptor => descriptor.options.group ?? 'Other', allScripts));
  } else {
    console.log('');
    R.forEach(printScript, allScripts);
  }

  console.log('');
  heroLog(chalk.gray.dim(`• reference scripts from other scripts using ${chalk.bold('script:name')}.`));
  heroLog(chalk.gray.dim('• see: https://darkobits.gitbook.io/nr/configuration-reference/script'));


  // ----- Determine if nr is in PATH ------------------------------------------

  let nrIsInPath = false;

  try {
    resolveCommand('nr');
    nrIsInPath = true;
  } catch {
    // nr is not in $PATH.
  }

  console.log('');

  // 🟩 🟨
  if (!nrIsInPath) {
    const contents = chalk.gray(`• ${chalk.green(`${chalk.bold('nr')} is in your PATH`)}; you can use the CLI directly: ${chalk.bold('nr query')}.`);
    heroLog(contents);

    // console.log(boxen(contents, {
    //   padding: {
    //     top: 0,
    //     bottom: 0,
    //     left: 1,
    //     right: 1
    //   },
    //   borderColor: '#242424'
    // }));
  } else {
    const contents = chalk.gray(`• ${chalk.yellow.dim(`${chalk.bold('nr')} is not in your PATH`)}; you must use the CLI with npx: ${chalk.bold('npx nr query')}.`);
    heroLog(contents);

    const pathDocs = chalk.gray.dim('• see: https://darkobits.gitbook.io/nr/getting-started/environment');
    heroLog(pathDocs);

    // console.log(boxen(contents, {
    //   padding: {
    //     top: 0,
    //     bottom: 0,
    //     left: 1,
    //     right: 1
    //   },
    //   borderColor: '#242424'
    // }));
  }
}


/**
 * Provided a search query, matches the query to a registered script and returns
 * its descriptor.
 */
export function matchScript(value?: string) {
  const scriptNames = [...scripts.keys()];
  if (scriptNames.length === 0) throw new Error(`[matchScript] Unable to match query ${chalk.green(value)}; no scripts have been registered.`);

  const scriptName = matchSegmentedName(scriptNames, value);

  const descriptor = scripts.get(scriptName ?? '');
  if (!descriptor) throw new Error(`[matchScript] "${value}" did not match any scripts.`);

  log.verbose(log.prefix('matchScript'), `Query ${chalk.green(value)} matched script ${chalk.green(scriptName)}.`);

  return descriptor;
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

    const canonicalName = name ?? 'anonymous';
    const logPrefix = getPrefixedInstructionName('script', canonicalName);

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
          const instructionThunks = value.map(resolveInstructionToThunk);

          return async () => {
            await pAll(instructionThunks);
          };
        }

        return resolveInstructionToThunk(value);
      });

      // Instructions may be added to a script definition dynamically, meaning
      // it is possible that a script has zero instructions under certain
      // conditions. When this is the case, issue a warning and bail.
      if (resolvedInstructions.length === 0) {
        log.warn(log.prefix(logPrefix), chalk.yellow.bold(`Script "${canonicalName}" contains no instructions.`));
        return;
      }

      const preScript = caseInsensitiveGet(`pre${name}`, scripts);
      if (preScript) await preScript.thunk();

      // Run each Instruction in series. If an Instruction is an Array, all
      // commands in that Instruction will be run in parallel.
      try {
        if (opts.timing) {
          heroLog(chalk.gray.dim(`○ ${canonicalName}`));
        }

        log.verbose(log.prefix(logPrefix), '•', chalk.green('start'));

        await pSeries(resolvedInstructions);

        log.verbose(log.prefix(logPrefix), '•', chalk.green(runTime));

        if (opts.timing) {
          heroLog(`${chalk.greenBright('⏺')} ${chalk.gray.dim(`${canonicalName} • ${runTime}`)}`);
        }
      } catch (err: any) {
        throw new Error(`${logPrefix} failed • ${err.message}`, { cause: err });
      }

      const postScript = caseInsensitiveGet(`post${name}`, scripts);
      if (postScript) await postScript.thunk();
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
