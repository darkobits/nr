#!/usr/bin/env node

import { EOL } from 'node:os';

import * as cli from '@darkobits/saffron';

import { command, commands, printCommandInfo } from 'lib/commands';
import { fn, functions, printFunctionInfo } from 'lib/functions';
import log from 'lib/log';
import { script, scripts, matchScript, printScriptInfo } from 'lib/scripts';
import { parseError, heroLog } from 'lib/utils';

import type { CLIArguments, UserConfigurationExport } from 'etc/types';

const chalk = log.chalk;

cli.command<CLIArguments, UserConfigurationExport>({
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
      conflicts: ['commands', 'functions', 'scripts']
    });

    command.option('scripts', {
      group: 'Introspection:',
      required: false,
      description: 'Show all registered scripts.',
      conflicts: ['commands', 'functions']
    });

    command.option('functions', {
      group: 'Introspection:',
      required: false,
      description: 'Show all registered functions.',
      conflicts: ['commands', 'scripts']
    });

    command.option('commands', {
      group: 'Introspection:',
      required: false,
      description: 'Show all registered commands.',
      conflicts: ['functions', 'scripts']
    });

    command.option('config', {
      type: 'string',
      required: false,
      description: 'Provide an explicit path to a configuration file.'
    });

    command.epilogue(chalk.gray('For full usage instructions, see https://github.com/darkobits/nr'));
  },
  handler: async saffronContext => {
    const { argv, config: userConfigExport, configIsEmpty, configPath } = saffronContext;

    try {
      if (!configPath) throw new Error([
        'Unable to find a configuration file.',
        'Documentation: https://darkobits.gitbook.io/nr'
      ].join(EOL));

      if (configIsEmpty)
        throw new Error(`Configuration file at ${chalk.green(configPath)} is empty.`);

      // If the configuration file did not default-export a function, bail.
      if (typeof userConfigExport !== 'function' && !Array.isArray(userConfigExport)) throw new TypeError(
        `Expected default export of file at ${chalk.green(configPath)} to be of type "function" or "Array", got "${typeof userConfigExport}".`
      );

      // Invoke the user's configuration function(s) with the necessary context.
      // The result should create at least 1 non-empty script.
      if (typeof userConfigExport === 'function') {
        await userConfigExport({ command, script, fn });
      } else if (Array.isArray(userConfigExport)) {
        for await (const userConfigFn of userConfigExport) {
          await userConfigFn({ command, script, fn });
        }
      }

      // If the user's configuration file did not register anything, this is
      // likely an error; bail.
      if (commands.size === 0 && functions.size === 0 && scripts.size === 0) throw new Error(
        `Configuration file ${chalk.green(configPath)} did not register any commands, functions, or scripts.`
      );

      // If the --commands, --functions, or --scripts flags were used, print
      // info about the indicated instruction type, then bail.
      if (argv.commands) return printCommandInfo(saffronContext);
      if (argv.functions) return printFunctionInfo(saffronContext);
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
