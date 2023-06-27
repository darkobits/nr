#!/usr/bin/env node

import { EOL } from 'os';

import * as cli from '@darkobits/saffron';

import { printCommandInfo } from 'lib/commands';
import loadConfig from 'lib/configuration';
import log from 'lib/log';
import {
  matchScript,
  printScriptInfo
} from 'lib/scripts';
import { printTaskInfo } from 'lib/tasks';
import { parseError, heroLog } from 'lib/utils';

import type { CLIArguments, ConfigurationFactory } from 'etc/types';


cli.command<CLIArguments, ConfigurationFactory>({
  command: '* [query]',
  description: 'Run the script matched by the provided query.',
  config: {
    auto: false
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
      group: 'Introspection:',
      type: 'boolean',
      required: false,
      description: 'Show all registered commands.',
      conflicts: ['tasks', 'scripts']
    });

    command.option('tasks', {
      group: 'Introspection:',
      type: 'boolean',
      required: false,
      description: 'Show all registered tasks.',
      conflicts: ['commands', 'scripts']
    });

    command.option('scripts', {
      group: 'Introspection:',
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
  handler: async saffronContext => {
    try {
      // Load the user's configuration file, which should populate the commands,
      // tasks, and/or scripts registries.
      await loadConfig(saffronContext);

      const { argv } = saffronContext;

      // If the --commands, --tasks, or --scripts flags were used, print
      // information about the indicated instruction type, then bail.
      if (argv.commands) return printCommandInfo(saffronContext);
      if (argv.tasks) return printTaskInfo(saffronContext);
      if (argv.scripts) return printScriptInfo(saffronContext);

      // Otherwise, ensure that a query was provided.
      if (!argv.query) {
        log.error('Missing required positional argument "query".');
        log.error(`Run ${log.chalk.white('nr --help')} for usage instructions.`);
        log.error(`Run ${log.chalk.white('nr --scripts')} to show a list of known scripts.`);
        return;
      }

      const script = matchScript(argv.query);

      if (script) {
        const runTime = log.createTimer();

        heroLog(log.chalk.gray.dim(`• ${script.name}`));

        await script.thunk();

        if (script.options.timing) {
          heroLog(log.chalk.gray.dim(`• ${script.name} • ${runTime}`));
        }
      }

    } catch (err: any) {
      const { message, stack } = parseError(err);

      heroLog(message.split(EOL).map(line => `${log.chalk.gray.dim('• error • ')}${log.chalk.red.bold(line)}`).join(EOL));

      if (log.isLevelAtLeast('verbose')) {
        heroLog(stack.split(EOL).map(line => `${log.chalk.gray.dim('• error • ')}${log.chalk.gray.dim(line)}`).join(EOL));
      }

      process.exit(err?.exitCode ?? 1);
    }
  }
});


cli.init();
