#!/usr/bin/env node

import cli from '@darkobits/saffron';

import { printCommandInfo } from 'lib/commands';
import loadConfig from 'lib/configuration';
import log from 'lib/log';
import {
  matchScript,
  executeScript,
  printScriptInfo
} from 'lib/scripts';
import { printTaskInfo } from 'lib/tasks';
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
    command.example('$0 --scripts', 'Lists available scripts.');

    command.positional('query', {
      type: 'string',
      description: 'Script name or query.',
      conflicts: ['commands', 'tasks', 'scripts']
    });

    command.option('commands', {
      type: 'boolean',
      required: false,
      description: 'Show all registered commands.',
      conflicts: ['tasks', 'scripts']
    });

    command.option('tasks', {
      type: 'boolean',
      required: false,
      description: 'Show all registered tasks.',
      conflicts: ['commands', 'scripts']
    });

    command.option('scripts', {
      type: 'boolean',
      required: false,
      description: 'Show all registered scripts.',
      conflicts: ['commands', 'tasks']
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

      // Load the user's configuration file.
      await loadConfig(opts);

      // If the --commands, --tasks, or --scripts flags were used, print
      // information about the indicated instruction type, then bail.
      if (argv.commands) {
        printCommandInfo();
        return;
      }

      if (argv.tasks) {
        printTaskInfo();
        return;
      }

      if (argv.scripts) {
        printScriptInfo();
        return;
      }

      // Ensure that a query was provided.
      if (!argv.query) {
        throw new Error('No query provided. Run "nr --scripts" to show available scripts.');
      }

      // Match and execute the indicated script.
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
