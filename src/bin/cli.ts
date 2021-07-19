#!/usr/bin/env node

import cli from '@darkobits/saffron';

import type { CLIArguments, ScriptConfiguration } from 'etc/types';
import loadConfig from 'lib/configuration';
import log from 'lib/log';
import { matchScript, executeScript, printAvailableScripts } from 'lib/scripts';
import { parseError } from 'lib/utils';


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
  handler: async opts => {
    let scriptConfig: ScriptConfiguration | undefined;

    try {
      const { argv } = opts;

      // If the user did not pass the --scripts option, ensure that they did
      // pass a positional argument indicating a script to run.
      if (!argv.scripts && !argv.script) {
        throw new Error('No script name provided.');
      }

      // Load the user's configuration file.
      await loadConfig(opts);

      // Finally, if the --scripts option was used, print the names and
      // descriptions of each registered script, then return.
      if (argv.scripts) {
        printAvailableScripts();
        return;
      }

      // Otherwise, match and execute the indicated script.
      const runTime = log.createTimer();
      scriptConfig = matchScript(argv.script);
      await executeScript(scriptConfig.name);

      // If the parent script is configured to log timing, do so.
      if (scriptConfig.timing) {
        log.info(log.chalk.gray(`Done in ${runTime}.`));
      }
    } catch (err) {
      const { message, stack } = parseError(err);
      log.error(log.chalk.red.bold(message));
      log.verbose(log.chalk.gray(stack));
      process.exit(err?.exitCode ?? 0);
    }
  }
});


cli.init(yargs => {
  yargs.scriptName('nr');
});
