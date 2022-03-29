import path from 'path';

import isCI from 'is-ci';

import { command } from 'lib/commands';
import { script, scripts } from 'lib/scripts';
import { task, tasks } from 'lib/tasks';

import type { SaffronHandlerOptions } from '@darkobits/saffron';
import type { CLIArguments, ConfigurationFactory } from 'etc/types';


/**
 * Responsible for interpreting command line arguments and Cosmiconfig results
 * to locate and parse the user's configuration file, then return the results.
 */
export default async function loadConfig({ argv, config, configPath, configIsEmpty }: SaffronHandlerOptions<CLIArguments, ConfigurationFactory>) {
  // If the --config option was used, load the file at the indicated path.
  if (argv.config) {
    configPath = path.resolve(argv.config);
    config = (await import(configPath)).default;
  } else if (configIsEmpty) {
    // Otherwise, if Cosmiconfig found an empty configuration file, throw.
    throw new Error(`Configuration file at ${configPath} is empty.`);
  } else if (!configPath) {
    // Otherwise, if Cosmiconfig did not find a configuration file, throw.
    throw new Error('Unable to find an nr.config.js file.');
  }

  // If the config file did not export a function, throw.
  if (typeof config !== 'function') {
    throw new TypeError(`Configuration file at ${configPath} does not have a default export of type "function".`);
  }

  // Invoke the user's configuration function.
  await config({
    command,
    script,
    task,
    isCI
  });

  // Ensure that after calling the user's configuration function, our scripts
  // registry is not empty.
  if (scripts.size === 0) {
    throw new Error('Configuration did not register any scripts.');
  }

  // Ensure that after calling the user's configuration function, our tasks and
  // commands registries are not empty.
  if (scripts.size === 0 && tasks.size === 0) {
    throw new Error('Configuration did not register any commands or tasks.');
  }

  return config;
}
