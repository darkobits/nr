#!/usr/bin/env node

import cli from '@darkobits/saffron';

import loadConfig from 'lib/configuration';
import log from 'lib/log';
import { matchScript, executeScript, printAvailableScripts } from 'lib/scripts';
import { parseError } from 'lib/utils';

import type { CLIArguments, ScriptDescriptor } from 'etc/types';


cli.command<CLIArguments, any>({
  command: '* [query]',
  description: 'Run the script matched by the provided query.',
  config: {
    auto: false,
    fileName: 'nr'
  },
  builder: ({ command }) => {
    command.example('$0 test', 'Runs the script named "test".');

    command.positional('query', {
      type: 'string',
      description: 'Script name or query.'
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

    command.epilogue(log.chalk.gray('For full usage instructions, see https://github.com/darkobits/nr'));
  },
  handler: async opts => {
    let scriptDescriptor: ScriptDescriptor | undefined;

    try {
      const { argv } = opts;

      // If the user did not pass the --scripts option, ensure that they did
      // pass a positional argument indicating a script to run.
      if (!argv.scripts && !argv.query) {
        throw new Error('No query provided. Run "nr --scripts" to show available scripts.');
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
      scriptDescriptor = matchScript(argv.query);
      await executeScript(scriptDescriptor.name);

      // If the parent script is configured to log timing, do so.
      if (scriptDescriptor.options.timing) {
        log.info(log.chalk.gray(`Done in ${runTime}.`));
      }
    } catch (err: any) {
      const { message, stack } = parseError(err);
      log.error(log.chalk.red.bold(message));
      log.verbose(log.chalk.gray(stack));
      process.exit(err?.exitCode ?? 1);
    }
  }
});


cli.init(yargs => {
  yargs.scriptName('nr');
});
