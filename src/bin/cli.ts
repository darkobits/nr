#!/usr/bin/env node

import { EOL } from 'os';

import * as cli from '@darkobits/saffron';
import isCI from 'is-ci';

import { command, commands, printCommandInfo } from 'lib/commands';
import log from 'lib/log';
import { script, scripts, matchScript, printScriptInfo } from 'lib/scripts';
import { task, tasks, printTaskInfo } from 'lib/tasks';
import { parseError, heroLog } from 'lib/utils';

import type { CLIArguments, UserConfigurationFn } from 'etc/types';


const chalk = log.chalk;


cli.command<CLIArguments, UserConfigurationFn>({
  command: '* [query]',
  description: 'Run the script matched by the provided query.',
  config: {
    auto: false,
    fileName: 'nr',
    explicitConfigFileParam: 'config'
  },
  builder: ({ command }) => {
    command.example('$0 test', 'Runs the script that most closely matches "test".');
    command.example('$0 --scripts', 'Lists available scripts.');

    command.positional('query', {
      type: 'string',
      description: 'Script name or query.',
      conflicts: ['commands', 'tasks', 'scripts']
    });

    command.option('scripts', {
      group: 'Introspection:',
      // type: 'boolean',
      required: false,
      description: 'Show all registered scripts.',
      conflicts: ['commands', 'tasks']
    });

    command.option('tasks', {
      group: 'Introspection:',
      // type: 'boolean',
      required: false,
      description: 'Show all registered tasks.',
      conflicts: ['commands', 'scripts']
    });

    command.option('commands', {
      group: 'Introspection:',
      // type: 'boolean',
      required: false,
      description: 'Show all registered commands.',
      conflicts: ['tasks', 'scripts']
    });

    command.option('config', {
      type: 'string',
      required: false,
      description: 'Provide an explicit path to a configuration file.'
    });

    command.epilogue(chalk.gray('For full usage instructions, see https://github.com/darkobits/nr'));
  },
  handler: async saffronContext => {
    const { argv, config, configIsEmpty, configPath } = saffronContext;

    try {
      // If Saffron did not find a configuration file, bail.
      if (!configPath) throw new Error([
        'Unable to find a configuration file.',
        'Documentation: https://darkobits.gitbook.io/nr'
      ].join(EOL));

      // If Saffron found an empty configuration file, bail.
      if (configIsEmpty) throw new Error(
        `Configuration file at ${chalk.green(configPath)} is empty.`
      );

      // If the configuration file did not default-export a function, bail.
      if (typeof config !== 'function') throw new TypeError(
        `Expected default export of file at ${chalk.green(configPath)} to be of type "function", got "${typeof config}".`
      );

      // Invoke the user's configuration function with the necessary context.
      // This function should create at least 1 command, task, or script.
      await config({ command, script, task, isCI });

      // If the user's configuration function did not register anything, this is
      // likely an error; bail.
      if (commands.size === 0 && tasks.size === 0 && scripts.size === 0) throw new Error(
        `Configuration file ${chalk.green(configPath)} did not register any commands, tasks, or scripts.`
      );

      // If the --commands, --tasks, or --scripts flags were used, print info
      // about the indicated instruction type, then bail.
      if (argv.commands) return printCommandInfo(saffronContext);
      if (argv.tasks) return printTaskInfo(saffronContext);
      if (argv.scripts) return printScriptInfo(saffronContext);

      // If none of the above flags were used, then `query` becomes a required
      // positional argument. If not present, bail.
      if (!argv.query) throw new Error([
        'Missing required positional argument "query".',
        `Run ${chalk.gray('nr --help')} for usage instructions.`,
        `Run ${chalk.gray('nr --scripts')} to show a list of known scripts.`
      ].join(EOL));

      const matchedScript = matchScript(argv.query);
      if (matchedScript) await matchedScript.thunk();
    } catch (err: any) {
      const { message, stack } = parseError(err);
      const errLinePrefix = `${chalk.red('⏺')}`;
      heroLog(message.split(EOL).map(line => `${errLinePrefix} ${chalk.red.bold(line)}`).join(EOL));
      heroLog(stack.split(EOL).map(line => `${errLinePrefix} ${chalk.gray.dim(line)}`).join(EOL));
      process.exit(err?.exitCode ?? err?.code ?? 1);
    }
  }
});


cli.init();
