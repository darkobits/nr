import path from 'path';

import isCI from 'is-ci';

import { createCommand, createNodeCommand, commands } from 'lib/commands';
import { createScript, scripts } from 'lib/scripts';

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
    throw new TypeError(`Configuration file at ${configPath} does not export a function.`);
  }

  // Invoke the user's configuration factory.
  await config({
    createCommand,
    createNodeCommand,
    createScript,
    isCI
  });

  // After calling the user's configuration factory, ensure that our command
  // registry is not empty.
  if (commands.size === 0) {
    throw new Error('Configuration failed to register any commands.');
  }

  // Ensure that our scripts registry is not empty.
  if (scripts.size === 0) {
    throw new Error('Configuration did not register any scripts.');
  }

  return config;
}
