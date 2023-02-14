import path from 'path';

import isCI from 'is-ci';

import { command, commands } from 'lib/commands';
import log from 'lib/log';
import { script, scripts } from 'lib/scripts';
import { task, tasks } from 'lib/tasks';

import type { SaffronHandlerContext } from '@darkobits/saffron';
import type { CLIArguments, ConfigurationFactory } from 'etc/types';


/**
 * Responsible for interpreting command line arguments and Cosmiconfig results
 * to locate and parse the user's configuration file, then return the results.
 */
export default async function loadConfig({ argv, config, configPath, configIsEmpty }: SaffronHandlerContext<CLIArguments, ConfigurationFactory>) {
  // If the --config option was used, load the file at the indicated path.
  if (argv.config) {
    configPath = path.resolve(argv.config);
    config = await import(configPath);
  } else if (configIsEmpty) {
    // Otherwise, if Cosmiconfig found an empty configuration file, throw.
    throw new Error(`Configuration file at ${log.chalk.green(configPath)} is empty.`);
  } else if (!configPath) {
    // Otherwise, if Cosmiconfig did not find a configuration file, throw.
    throw new Error('Unable to find an nr configuration file.');
  }

  // Handle ESM interop issues resulting in multiple nested "default" properties
  // on modules.
  let configFn = config ?? {};

  while (Reflect.has(configFn, 'default')) {
    configFn = Reflect.get(configFn, 'default');
  }

  // If the config file did not default-export a function, throw.
  if (typeof configFn !== 'function') {
    log.verbose(log.prefix('config'), configFn);
    throw new TypeError(`Expected default export of configuration file at ${log.chalk.green(configPath)} to be of type "function", got "${typeof configFn}".`);
  }

  // Invoke the user's configuration function with the necessary context.
  await configFn({ command, script, task, isCI });

  // Ensure that the user's configuration function actually did something.
  if (commands.size === 0 && tasks.size === 0 && scripts.size === 0) {
    throw new Error(`Configuration file at ${log.chalk.green(configPath)} did not register any commands, tasks, or scripts.`);
  }
}
