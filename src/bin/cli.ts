#!/usr/bin/env node

import path from 'path';

import cli from '@darkobits/saffron';

import type { CLIArguments } from 'etc/types';
import {
  createCommand,
  commands
} from 'lib/commands';
import log from 'lib/log';
import {
  createScript,
  executeScript,
  scripts,
  scriptConfigs
} from 'lib/scripts';


cli.command<CLIArguments, any>({
  command: '* [script]',
  description: 'Run the indicated script.',
  config: {
    auto: false,
    fileName: 'nr'
  },
  builder: ({ command }) => {
    command.example('$0 test', 'Runs the script named "test".');

    command.positional('script', {
      type: 'string',
      description: 'Script name or partial script name to run.'
    });

    command.option('scripts', {
      type: 'boolean',
      required: false,
      description: 'Show all registered scripts.'
    });

    command.option('config', {
      type: 'string',
      required: false,
      description: 'Provide an explicit path to a configuration file.'
    });
  },
  handler: async ({ argv, config, configPath, configIsEmpty }) => {
    try {
      const { config: configFlag, script, scripts: scriptsFlag } = argv;

      // If the user did not pass the --scripts option, ensure that they did
      // pass a positional argument indicating a script to run.
      if (!scriptsFlag && !script) {
        throw new Error('No script name provided.');
      }

      // If the --config option was used, load the file at the indicated path
      // and update our variables.
      if (configFlag) {
        configPath = path.resolve(configFlag);
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
      await config({ createCommand, createScript });

      // After calling the user's configuration factory, ensure that our command
      // registry is not empty.
      if (commands.size === 0) {
        throw new Error('Configuration failed to register any commands.');
      }

      // Ensure that our scripts registry is not empty.
      if (scripts.size === 0) {
        throw new Error('Configuration failed to register any scripts.');
      }

      // Finally, if the --scripts option was used, print the names and
      // descriptions of each registered script, then return.
      if (scriptsFlag) {
        console.log('Available scripts:\n');
        scriptConfigs.forEach((scriptConfig, scriptName) => {
          console.log(log.chalk.green(scriptName), `:: ${log.chalk.gray(scriptConfig.description)}`);
        });

        return;
      }

      // Otherwise, match and execute the indicated script.
      await executeScript(argv.script);
    } catch (err) {
      log.error(err);
      process.exit(1);
    }
  }
});


cli.init(yargs => {
  yargs.scriptName('nr');
});
