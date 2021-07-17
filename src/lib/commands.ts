import execa from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import ow from 'ow';
import unParseArgs from 'yargs-unparser';

import { IS_COMMAND_THUNK } from 'etc/constants';
import {
  CommandThunk,
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
const commandConfigs = new Map<CommandThunk, CreateCommandOptions>();


/**
 * @private
 *
 * Provided an arguments object, returns an array of strings representing the
 * "un-parsed" arguments.
 */
function parseArguments(args: CreateCommandOptions['arguments'], preserveArguments?: boolean) {
  const {
    _: positionals,
    ...flags
  } = Object.assign({_: []}, args);

  // Convert arguments object to an array of strings, first converting any
  // flags to kebab-case, unless preserveKeys is truthy.
  return unParseArgs(Object.assign(
    {_: positionals},
    preserveArguments ? flags : kebabCaseKeys(flags)
  ));
}


/**
 * Provided a command options object, creates a function that, when invoked,
 * will execute the command. This function is then added to the commands
 * registry.
 */
export function createCommand(opts: CreateCommandOptions) {
  try {
    // Validate options.
    ow<CreateCommandOptions>(opts, ow.object.exactShape({
      name: ow.any(
        ow.undefined,
        ow.string
      ),
      command: ow.string,
      arguments: ow.any(
        ow.undefined,
        ow.object.is(obj => {
          Object.entries(obj).forEach(([key, value]) => {
            if (key === '_') {
              ow(value, key, ow.any(
                ow.string,
                ow.array.ofType(ow.string)
              ));
            } else {
              ow(value, key, ow.any(
                ow.string,
                ow.number,
                ow.boolean
              ));
            }
          });

          return true;
        })
      ),
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
    }));

    // const firstSegmentOfName = opts.command;
    const parsedArguments = parseArguments(opts.arguments, opts.preserveArguments);

    const commandThunk: CommandThunk = Object.assign(async () => {
      const runTime = log.createTimer();

      // Log the exact command being run at the verbose level.
      log.verbose(log.prefix('cmd'), 'exec:', log.chalk.gray(opts.command), log.chalk.gray(parsedArguments.join(' ')));

      const command = execa(opts.command, parsedArguments, {
        stdio: 'pipe',
        env: {
          // This is needed to maintain colors in piped output.
          FORCE_COLOR: 'true'
        },
        // Prefer locally-installed versions of executables. For example, this
        // will search in the local NPM bin folder even if the user hasn't added
        // it to their $PATH.
        preferLocal: true,
        ...opts.execaOptions
      });

      // If the user provided a custom prefix function, generate it now.
      const prefix = opts.prefix ? opts.prefix(log.chalk) : '';

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
        if (code === 0 || opts.execaOptions?.reject === false) {
          // If the command exited successfully or if we are ignoring failed
          // commands, log completion time.
          log.verbose(log.prefix(opts.command), log.chalk.gray(`Done in ${runTime}.`));
        }
      });

      await command;
    }, {
      [IS_COMMAND_THUNK]: true
    });

    if (opts.name) {
      commands.set(opts.name, commandThunk);
    }

    commandConfigs.set(commandThunk, opts);

    return commandThunk;
  } catch (err) {
    log.error(log.chalk.red.bold(`Unable to create command "${opts.name}":`));

    // Re-throw errors related to creating commands so that our caller can exit
    // with a non-zero code.
    throw err;
  }
}
