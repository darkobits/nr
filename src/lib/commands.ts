import execa from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import ow from 'ow';
import unParseArgs from 'yargs-unparser';

import { IS_COMMAND_THUNK } from 'etc/constants';
import {
  CommandName,
  CommandThunk,
  CreateCommandArguments,
  CreateCommandOptions
} from 'etc/types';
import log, { LogPipe } from 'lib/log';


/**
 * Map of registered command names to their corresponding command thunks.
 */
export const commands = new Map<string, CommandThunk>();


/**
 * @private
 *
 * Map of registered command names to their corresponding configurations.
 */
const commandConfigs = new Map<CommandThunk, [CreateCommandArguments, CreateCommandOptions | undefined]>();


/**
 * @private
 *
 * Provided an arguments array, returns an array of strings representing the
 * "un-parsed" arguments.
 */
function parseArguments(args: CreateCommandArguments, preserveArguments?: boolean) {
  ow(args, 'command and arguments', ow.array.maxLength(3));
  ow(args[0], 'command', ow.string);

  if (args.length === 1) {
    return [''];
  }

  let positionals: CreateCommandArguments['1'] = [];
  let flags: CreateCommandArguments['2'] = {};

  if (args.length === 2) {
    if (Array.isArray(args[1])) {
      // Got [command, positionals] form.
      ow(args[1], 'positional arguments', ow.array.ofType(ow.string));
      positionals = args[1];
    } else {
      // Got [command, flags] form.
      ow(args[1], 'flags', ow.object);
      flags = args[1];
    }
  } else if (args.length === 3) {
    // Got [command, positionals, flags] form.
    ow(args[1], 'positional arguments', ow.array.ofType(ow.string));
    positionals = args[1];
    ow(args[2], 'flags', ow.object);
    flags = args[2];
  }

  // Convert arguments object to an array of strings, first converting any
  // flags to kebab-case, unless preserveKeys is truthy.
  return unParseArgs(Object.assign(
    {_: positionals},
    preserveArguments ? flags : kebabCaseKeys(flags)
  ));
}


// createCommand('babel.watch', [
//   'babel', ['src'], { outDir: 'dist', copyFiles: true }
// ], {
//   prefix: () => {}, preserveArguments: true
// });

// createCommand.from('babel.watch', [
//   ['otherSrc'], { foo: 'bar' }
// ], {
//   preserveArguments: true
// });


// createScript('babel.watch', )
//
//


/**
 * Provided a command options object, creates a function that, when invoked,
 * will execute the command. This function is then added to the commands
 * registry.
 */
export function createCommand(name: CommandName, args: CreateCommandArguments, opts?: CreateCommandOptions) {
  try {
    // Validate name.
    ow(name, 'name', ow.string);

    // Parse and validate command and arguments.
    const parsedArguments = parseArguments(args, opts?.preserveArguments);
    const [executableName] = args;

    // Validate options.
    ow<CreateCommandOptions | undefined>(opts, ow.any(
      ow.undefined,
      ow.object.exactShape({
        prefix: ow.any(
          ow.undefined,
          ow.function
        ),
        execaOptions: ow.any(
          ow.undefined,
          ow.object.nonEmpty
        ),
        preserveArguments: ow.any(
          ow.undefined,
          ow.boolean
        )
      })
    ));

    const commandThunk: CommandThunk = Object.assign(async () => {
      const runTime = log.createTimer();

      // Log the exact command being run at the verbose level.
      log.verbose(log.prefix('cmd'), 'exec:', log.chalk.gray(executableName), log.chalk.gray(parsedArguments.join(' ')));

      const command = execa(executableName, parsedArguments, {
        stdio: 'pipe',
        env: {
          // This is needed to maintain colors in piped output.
          FORCE_COLOR: 'true'
        },
        // Prefer locally-installed versions of executables. For example, this
        // will search in the local NPM bin folder even if the user hasn't added
        // it to their $PATH.
        preferLocal: true,
        ...opts?.execaOptions
      });

      // If the user provided a custom prefix function, generate it now.
      const prefix = opts?.prefix ? opts.prefix(log.chalk) : '';

      if (command.stdout) {
        command.stdout.pipe(new LogPipe((...args: Array<any>) => {
          console.log(...[prefix, ...args].filter(Boolean));
        }));
      }

      if (command.stderr) {
        command.stderr.pipe(new LogPipe((...args: Array<any>) => {
          console.error(...[prefix, ...args].filter(Boolean));
        }));
      }

      void command.on('exit', code => {
        if (code === 0 || opts?.execaOptions?.reject === false) {
          // If the command exited successfully or if we are ignoring failed
          // commands, log completion time.
          log.verbose(log.prefix(executableName), log.chalk.gray(`Done in ${runTime}.`));
        }
      });

      await command;
    }, {
      [IS_COMMAND_THUNK]: true
    });

    commands.set(name, commandThunk);
    commandConfigs.set(commandThunk, [args, opts]);

    return commandThunk;
  } catch (err) {
    throw new Error(`Unable to create command "${name}": ${err.message}`);
  }
}
